const questions = require("../quiz-data.js");
const correctAnswers = questions.map((question) => question.correctAnswer);

function respondError(res, status, message) {
  return res.status(status).json({ error: message });
}

module.exports = async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return respondError(res, 500, "O ranking ainda não foi configurado.");
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/quiz_results`;
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  };

  try {
    if (req.method === "GET") {
      const response = await fetch(
        `${endpoint}?select=student_name,score&order=score.desc,created_at.asc&limit=10`,
        { headers }
      );

      if (!response.ok) {
        return respondError(res, 502, "Não foi possível carregar o ranking.");
      }

      const results = await response.json();
      return res.status(200).json(
        results.map((result) => ({ name: result.student_name, score: result.score }))
      );
    }

    if (req.method === "POST") {
      const { name, answers } = req.body || {};
      const studentName = typeof name === "string" ? name.trim() : "";

      if (studentName.length < 1 || studentName.length > 80) {
        return respondError(res, 400, "Digite um nome entre 1 e 80 caracteres.");
      }

      if (
        !Array.isArray(answers) ||
        answers.length !== correctAnswers.length ||
        answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)
      ) {
        return respondError(res, 400, "As respostas enviadas são inválidas.");
      }

      const score = answers.reduce(
        (total, answer, index) => total + (answer === correctAnswers[index] ? 1 : 0),
        0
      );
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ student_name: studentName, score, answers })
      });

      if (!response.ok) {
        return respondError(res, 502, "Não foi possível salvar sua pontuação.");
      }

      return res.status(201).json({ score });
    }

    res.setHeader("Allow", "GET, POST");
    return respondError(res, 405, "Método não permitido.");
  } catch (error) {
    if (error instanceof TypeError) {
      return respondError(res, 502, "Não foi possível conectar ao banco de dados.");
    }

    throw error;
  }
};
