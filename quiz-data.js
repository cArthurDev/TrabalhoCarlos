(() => {
  const questions = [
    {
      title: "Segundo a OMS e a UNICEF (2025), quantas pessoas não tinham acesso a água potável segura em 2024?",
      illustration: "💧",
      illustrationClass: "water",
      answers: [
        "210 milhões",
        "500 milhões",
        "2,1 bilhões",
        "4,5 bilhões"
      ],
      correctAnswer: 2
    },
    {
      title: "Qual sequência de processos químicos e físicos é fundamental no tratamento da água potável?",
      illustration: "⚗️",
      illustrationClass: "chemistry",
      answers: [
        "Destilação, combustão e eletrólise",
        "Coagulação, filtração e desinfecção",
        "Sublimação, oxidação e decantação",
        "Fermentação e neutralização"
      ],
      correctAnswer: 1
    },
    {
      title: "Por que apenas inventar uma tecnologia química não basta para reduzir a desigualdade social?",
      illustration: "🔬",
      illustrationClass: "planet",
      answers: [
        "Porque depende de investimento público, infraestrutura e políticas",
        "Porque a água tratada não previne doenças",
        "Porque tecnologias químicas não funcionam fora de capitais",
        "Porque os produtos químicos são sempre tóxicos"
      ],
      correctAnswer: 0
    },
    {
      title: "Segundo o PNUMA, qual cuidado é indispensável para proteger populações vulneráveis?",
      illustration: "💧",
      illustrationClass: "water",
      answers: [
        "Eliminar todo uso industrial de substâncias químicas",
        "Gerenciamento seguro e descarte correto de resíduos químicos",
        "Usar apenas filtros caseiros simples sem tratamento",
        "Restringir o ensino de Química ao ensino superior"
      ],
      correctAnswer: 1
    }
  ];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = questions;
  } else {
    window.quizQuestions = questions;
  }
})();
