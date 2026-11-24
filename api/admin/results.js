const questions = require("../../quiz-data.js");
const { isAdminRequest } = require("../../lib/admin-auth.js");

function respondError(res, status, message) {
  return res.status(status).json({ error: message });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return respondError(res, 405, "Método não permitido.");
  }

  if (!isAdminRequest(req)) {
    return respondError(res, 401, "Faça login para ver as respostas.");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return respondError(res, 500, "O banco de dados ainda não foi configurado.");
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/quiz_results`;
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  };

  try {
    const response = await fetch(
      `${endpoint}?select=id,student_name,score,answers,created_at&order=created_at.desc&limit=500`,
      { headers }
    );

    if (!response.ok) {
      return respondError(res, 502, "Não foi possível carregar as respostas.");
    }

    const results = await response.json();
    return res.status(200).json(
      results.map((result) => ({
        id: result.id,
        name: result.student_name,
        score: result.score,
        createdAt: result.created_at,
        answers: Array.isArray(result.answers)
          ? questions.map((question, index) => {
              const answerIndex = result.answers[index];
              const hasAnswer =
                Number.isInteger(answerIndex) &&
                answerIndex >= 0 &&
                answerIndex < question.answers.length;
              return {
                question: question.title,
                selectedAnswer: hasAnswer ? question.answers[answerIndex] : null,
                correctAnswer: question.answers[question.correctAnswer],
                isCorrect: hasAnswer ? answerIndex === question.correctAnswer : null
              };
            })
          : null
      }))
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return respondError(res, 502, "Não foi possível conectar ao banco de dados.");
    }

    throw error;
  }
};
