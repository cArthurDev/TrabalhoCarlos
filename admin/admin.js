const questions = window.quizQuestions;
const loginPanel = document.getElementById("login-panel");
const resultsPanel = document.getElementById("results-panel");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginStatus = document.getElementById("login-status");
const resultsHead = document.getElementById("results-head");
const resultsBody = document.getElementById("results-body");
const resultsSummary = document.getElementById("results-summary");
const tableStatus = document.getElementById("table-status");

function showLogin(message = "") {
  loginPanel.hidden = false;
  resultsPanel.hidden = true;
  loginStatus.textContent = message;
}

function showResults() {
  loginPanel.hidden = true;
  resultsPanel.hidden = false;
  loginStatus.textContent = "";
}

async function requestJSON(url, options) {
  const response = await fetch(url, options);
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("O servidor retornou uma resposta inválida.");
  }

  if (!response.ok) {
    const error = new Error(data.error || "Não foi possível concluir a solicitação.");
    error.status = response.status;
    throw error;
  }

  return data;
}

function appendAnswerCell(answer) {
  const cell = document.createElement("td");

  if (!answer) {
    cell.textContent = "Detalhe indisponível para esta resposta antiga.";
    return cell;
  }

  if (answer.isCorrect === null) {
    cell.textContent = "Resposta não registrada.";
    return cell;
  }

  const status = document.createElement("span");
  status.className = `answer-status ${answer.isCorrect ? "correct" : "incorrect"}`;
  status.textContent = answer.isCorrect ? "Acertou" : "Errou";
  cell.appendChild(status);

  const selected = document.createElement("p");
  selected.className = "answer-copy";
  const selectedLabel = document.createElement("strong");
  selectedLabel.textContent = answer.isCorrect ? "Resposta: " : "Marcada: ";
  selected.append(selectedLabel, document.createTextNode(answer.selectedAnswer));
  cell.appendChild(selected);

  if (!answer.isCorrect) {
    const correct = document.createElement("p");
    correct.className = "answer-copy";
    const correctLabel = document.createElement("strong");
    correctLabel.textContent = "Correta: ";
    correct.append(correctLabel, document.createTextNode(answer.correctAnswer));
    cell.appendChild(correct);
  }

  return cell;
}

function renderResults(results) {
  const headerRow = document.createElement("tr");
  const headers = [
    { label: "Aluno" },
    { label: "Nota" },
    ...questions.map((question, index) => ({
      label: `Pergunta ${index + 1}`,
      detail: question.title
    })),
    { label: "Enviado em" }
  ];
  headers.forEach(({ label, detail }) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;

    if (detail) {
      const description = document.createElement("span");
      description.className = "question-header-detail";
      description.textContent = detail;
      cell.appendChild(description);
    }

    headerRow.appendChild(cell);
  });
  resultsHead.replaceChildren(headerRow);
  resultsBody.replaceChildren();
  resultsSummary.textContent = `${results.length} ${results.length === 1 ? "resposta registrada" : "respostas registradas"}`;
  tableStatus.textContent = "";

  if (results.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty-cell";
    cell.colSpan = questions.length + 3;
    cell.textContent = "Ainda não há respostas.";
    row.appendChild(cell);
    resultsBody.appendChild(row);
    return;
  }

  results.forEach((result) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.className = "student-name";
    nameCell.textContent = result.name;
    row.appendChild(nameCell);

    const scoreCell = document.createElement("td");
    scoreCell.className = "score-cell";
    scoreCell.textContent = `${result.score} / ${questions.length}`;
    row.appendChild(scoreCell);

    questions.forEach((_, index) => {
      row.appendChild(appendAnswerCell(result.answers && result.answers[index]));
    });

    const dateCell = document.createElement("td");
    dateCell.className = "date-cell";
    dateCell.textContent = new Date(result.createdAt).toLocaleString("pt-BR");
    row.appendChild(dateCell);
    resultsBody.appendChild(row);
  });
}

async function loadResults() {
  resultsSummary.textContent = "Carregando respostas...";
  tableStatus.textContent = "";

  try {
    const results = await requestJSON("/api/admin/results");
    showResults();
    renderResults(results);
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }

    showLogin(error.message || "Não foi possível carregar as respostas.");
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginButton.disabled = true;
  loginStatus.textContent = "";

  try {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    await requestJSON("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    document.getElementById("password").value = "";
    await loadResults();
  } catch (error) {
    loginStatus.textContent = error.message || "Não foi possível entrar.";
  } finally {
    loginButton.disabled = false;
  }
});

document.getElementById("refresh-button").addEventListener("click", loadResults);
document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    await requestJSON("/api/admin/logout", { method: "POST" });
    showLogin("Você saiu da administração.");
  } catch (error) {
    tableStatus.textContent = error.message || "Não foi possível sair.";
  }
});

loadResults();
