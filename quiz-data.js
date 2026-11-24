(() => {
  const questions = [
    {
      title: "A Química está presente em diversas atividades do nosso cotidiano, contribuindo para a saúde, alimentação e higiene. Qual é sua principal contribuição para a sociedade?",
      illustration: "⚗️",
      illustrationClass: "chemistry",
      answers: [
        "Produzir apenas produtos industriais.",
        "Melhorar a qualidade de vida por meio de tecnologias e conhecimentos científicos.",
        "Substituir todos os recursos naturais.",
        "Aumentar a desigualdade social."
      ],
      correctAnswer: 1
    },
    {
      title: "O acesso à água potável é um direito essencial, mas ainda representa um desafio para muitas pessoas. Segundo o banner, quantas pessoas aproximadamente não tinham acesso seguro à água potável em 2024?",
      illustration: "💧",
      illustrationClass: "water",
      answers: [
        "500 milhões.",
        "1 bilhão.",
        "2,1 bilhões.",
        "3 bilhões."
      ],
      correctAnswer: 2
    },
    {
      title: "A Química possui um papel importante na prevenção de doenças e na melhoria da saúde pública. De que maneira ela pode contribuir?",
      illustration: "🔬",
      illustrationClass: "chemistry",
      answers: [
        "Desenvolvendo medicamentos e tecnologias de tratamento da água.",
        "Aumentando a poluição ambiental.",
        "Impedindo o acesso à ciência.",
        "Reduzindo a produção de alimentos."
      ],
      correctAnswer: 0
    },
    {
      title: "Quando o acesso às tecnologias químicas não acontece de forma igualitária, algumas comunidades ficam mais vulneráveis a problemas ambientais e de saúde. Qual é uma consequência dessa desigualdade?",
      illustration: "🌍",
      illustrationClass: "planet",
      answers: [
        "Todas as pessoas possuem as mesmas condições de saúde.",
        "Diminuição das doenças em todas as regiões.",
        "Maior acesso ao saneamento básico.",
        "Maior exposição das populações vulneráveis à poluição e às doenças."
      ],
      correctAnswer: 3
    },
    {
      title: "Para que os benefícios da ciência e da tecnologia cheguem a toda a população, são necessários investimentos e oportunidades iguais. O que é fundamental para alcançar esse objetivo?",
      illustration: "🏛️",
      illustrationClass: "planet",
      answers: [
        "Apenas investimentos em empresas privadas.",
        "Investimento público, educação científica e distribuição justa das tecnologias.",
        "Diminuir o acesso à educação.",
        "Impedir o desenvolvimento científico."
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
