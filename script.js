const questions = window.quizQuestions;

const nameScreen = document.getElementById("name-screen");
const questionScreen = document.getElementById("question-screen");
const thanksScreen = document.getElementById("thanks-screen");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("student-name");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const questionTitle = document.getElementById("question-title");
const illustration = document.getElementById("question-illustration");
const answersContainer = document.getElementById("answers");
const finalScore = document.getElementById("final-score");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardError = document.getElementById("leaderboard-error");

let currentQuestion = 0;
let studentName = "";
let selectedAnswers = [];

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}

function renderQuestion() {
  const question = questions[currentQuestion];

  progressLabel.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionTitle.textContent = question.title;
  illustration.textContent = question.illustration;
  illustration.className = `illustration ${question.illustrationClass}`;
  answersContainer.replaceChildren();

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.innerHTML = `
      <span class="answer-shape" aria-hidden="true"></span>
      <span>${answer}</span>
      <span class="answer-arrow" aria-hidden="true"></span>
    `;
    button.addEventListener("click", () => nextQuestion(answerIndex));
    answersContainer.appendChild(button);
  });
}

function nextQuestion(answerIndex) {
  selectedAnswers[currentQuestion] = answerIndex;
  currentQuestion += 1;

  if (currentQuestion < questions.length) {
    renderQuestion();
    return;
  }

  const score = selectedAnswers.reduce(
    (total, answer, index) => total + (answer === questions[index].correctAnswer ? 1 : 0),
    0
  );
  finalScore.textContent = `Você acertou ${score} de ${questions.length} perguntas.`;
  leaderboardError.textContent = "";
  leaderboardList.replaceChildren();
  const loadingMessage = document.createElement("li");
  loadingMessage.className = "leaderboard-status";
  loadingMessage.textContent = "Salvando sua resposta e carregando o ranking...";
  leaderboardList.appendChild(loadingMessage);
  showScreen(thanksScreen);
  saveResultAndLoadRanking();
}

async function saveResultAndLoadRanking() {
  try {
    const saveResponse = await fetch("/api/ranking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: studentName, answers: selectedAnswers })
    });

    if (!saveResponse.ok) {
      throw new Error("Não foi possível salvar sua pontuação.");
    }

    const rankingResponse = await fetch("/api/ranking");
    if (!rankingResponse.ok) {
      throw new Error("Sua pontuação foi salva, mas não foi possível carregar o ranking.");
    }

    const ranking = await rankingResponse.json();
    leaderboardList.replaceChildren();

    if (ranking.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.className = "leaderboard-status";
      emptyMessage.textContent = "Ainda não há respostas no ranking.";
      leaderboardList.appendChild(emptyMessage);
      return;
    }

    ranking.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "leaderboard-entry";

      const name = document.createElement("span");
      name.className = "leaderboard-name";
      name.textContent = `${index + 1}. ${entry.name}`;

      const score = document.createElement("span");
      score.className = "leaderboard-points";
      score.textContent = `${entry.score} / ${questions.length}`;

      item.append(name, score);
      leaderboardList.appendChild(item);
    });
  } catch (error) {
    leaderboardList.replaceChildren();
    leaderboardError.textContent = error.message || "Não foi possível conectar ao ranking.";
  }
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  studentName = nameInput.value.trim();
  if (!studentName) {
    nameInput.focus();
    return;
  }

  currentQuestion = 0;
  selectedAnswers = [];
  renderQuestion();
  showScreen(questionScreen);
});
