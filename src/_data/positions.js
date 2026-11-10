// The three articles, for the Thinking feeds (src/thinking/feed.njk and its
// Spanish twin). Title and description come from each page's own front
// matter; only the dates live here, because the feed needs them as data.
// Adding an article means a line here as well as its pages.
// beco-explorer has no datePublished of its own; 2026-09-12 is its first commit.
const articles = [
  { slug: "ai-workflow-framework", published: "2026-06-11", updated: "2026-10-25" },
  { slug: "beco-knowledge-graph", published: "2026-09-12", updated: "2026-10-24" },
  { slug: "beco-explorer", published: "2026-09-12", updated: "2026-10-24" },
];


// The four short positions on the Thinking page, in the order it shows them.
//
// What reads from here:
//   - the positions index on both Thinking pages (src/thinking.html,
//     src/es/thinking.html): topic, title and the diagram
//   - each position's own page, /thinking/positions/<slug>/ and its Spanish
//     twin, through src/_includes/position.njk
//
// `title` is the claim (the page's <h1>), `topic` the short name used in
// <title> and the breadcrumb, `description` the meta description (160
// characters at most; the build checks). The diagrams are the same in both
// languages and live in src/_includes/positions/<slug>.svg.njk. Adding a
// position means an entry here, its diagram and a page file in each language
// (a one-line extend, as the existing four are).
module.exports = {
  articles,
  published: "2026-06-05",
  updated: "2026-10-25",
  list: [
    {
      slug: "positional-empathy",
      en: {
        description: "In enterprise work, the empathy that moves projects forward is positional: mapping what each person sees, optimises for and fears.",
        topic: "Positional Empathy",
        title: "In enterprise work, the empathy that moves projects forward is positional.",
        body: [
          "There's a version of empathy that's emotional: you put yourself in someone's position and feel what they might feel. That has real value: it's the foundation of personal connection and deep user trust. But in design work, especially inside large organisations, what's more useful day-to-day is a different kind: the ability to map how another person understands the situation, what they're optimising for, what they're afraid of, and what they need to be true in order to move forward.",
          "I've started calling this positional empathy. It sits alongside compassion rather than standing in for it, and it's turned out to be one of the more useful skills I've picked up in enterprise work. Most of the genuinely hard problems in these environments have nothing to do with visuals or technical execution. People show up misaligned, working from different mental models of the same problem, carrying incentives the brief never mentions.",
          "Map that out accurately, without losing your own read on it, and you can usually work through it. The goal is to understand the situation well enough that people stop arguing about the wrong things.",
        ],
        caption: "You map stakeholder alignment the same way you'd map any other system.",
      },
      es: {
        description: "En el trabajo con grandes empresas, la empatía que hace avanzar los proyectos es posicional: mapear qué ve, qué optimiza y qué teme cada persona.",
        topic: "Empatía Posicional",
        title: "En el trabajo empresarial, la empatía que hace avanzar los proyectos es posicional.",
        body: [
          "Hay una versión de la empatía que es emocional: te pones en el lugar de alguien y sientes lo que podría sentir. Eso tiene un valor real: es la base de la conexión personal y de la confianza profunda con los usuarios. Pero en el trabajo de diseño, especialmente dentro de grandes organizaciones, lo que resulta más útil en el día a día es un tipo diferente: la capacidad de mapear cómo otra persona entiende la situación, qué está optimizando, qué le preocupa y qué necesita que sea verdad para poder avanzar.",
          "Empecé a llamarlo empatía posicional: convive con la compasión, no la sustituye, y se ha convertido en una de las habilidades más útiles que tengo en el trabajo con grandes empresas. La mayoría de los problemas realmente difíciles en estos entornos no son visuales ni técnicos. La gente llega desalineada, trabajando con modelos mentales distintos del mismo problema, con incentivos que el briefing nunca menciona.",
          "Si mapeas bien esa situación, sin perder tu propio criterio en el proceso, casi siempre encuentras la forma de avanzar. El objetivo es entender la situación lo suficiente como para que la gente deje de discutir sobre lo que no importa.",
        ],
        caption: "La alineación con los stakeholders se mapea, igual que cualquier otro sistema.",
      },
    },
    {
      slug: "behavioural-economics",
      en: {
        description: "Most design decisions are behavioural decisions: the order of information, gain or loss framing and defaults decide what people do.",
        topic: "Behavioural Economics",
        title: "Most design decisions are really behavioural decisions wearing a visual disguise.",
        body: [
          "The standard design process asks what users need. That's a fine question, but it's not the one I spend most of my time on. The behavioural economics question asks something narrower and, I'd argue, more useful: given how people's cognition actually works, with its shortcuts and biases and context-dependence, what is this specific interface going to make them do?",
          "Years of conversion rate optimisation across banking, insurance, loyalty, and e-commerce taught me that the answer to that question usually comes down to details nobody thinks to argue about: the order information appears on a page, whether a choice is framed as a gain or a loss, whether there's a default option at all. Get those wrong and no amount of good intentions in the brief saves the design.",
          "The point is to understand how decisions are actually made, under time pressure, with incomplete information, shaped by context, and designing for that reality rather than an idealised version of it.",
        ],
        caption: "What users need and what users do are different questions. The behavioural approach changes the choice architecture itself instead of collecting more stated preferences.",
      },
      es: {
        description: "Casi todas las decisiones de diseño son de comportamiento: el orden de la información, el encuadre y los valores por defecto deciden qué hace la gente.",
        topic: "Economía Conductual",
        title: "La mayoría de las decisiones de diseño son decisiones de comportamiento disfrazadas de decisiones visuales.",
        body: [
          "El proceso de diseño estándar pregunta qué necesitan los usuarios. Es una pregunta razonable, pero no es la que más me ocupa. La pregunta desde la economía conductual es más concreta y, para mí, más útil: dado cómo funciona de verdad la cognición humana, con sus atajos, sesgos y dependencia del contexto, ¿qué va a hacer esta interfaz concreta que la gente haga?",
          "Años de optimización de conversión en banca, seguros, fidelización y e-commerce me enseñaron que la respuesta casi siempre está en detalles de los que nadie discute: el orden de la información en una página, si una elección se presenta como ganancia o como pérdida, si existe o no un valor por defecto. Fallar ahí hunde el diseño por muy buenas que sean las intenciones del briefing.",
          "Se trata de entender cómo se toman realmente las decisiones, bajo presión de tiempo, con información incompleta, moldeadas por el contexto, y diseñar para esa realidad en lugar de una versión idealizada de ella.",
        ],
        caption: "El enfoque conductual cambia directamente la arquitectura de la elección en lugar de preguntar más por lo que la gente prefiere.",
      },
    },
    {
      slug: "resilient-systems",
      en: {
        description: "The best process does not depend on one person to remember it. How a principle-first working system held up at IKEA Home Services.",
        topic: "Resilient Systems",
        title: "The best process is one that doesn't depend on any single person to remember it.",
        body: [
          "When I joined the IKEA Home Services team, there was no shared working system. Files existed everywhere. The hierarchy of work, what belonged in Figma, what in Confluence, what in Jira, was unclear and inconsistently applied. The process that existed depended on specific individuals to hold it in memory and transmit it informally. When those individuals weren't available, the system collapsed.",
          "My approach was to start with principles rather than tools. I mapped the actual work the team was doing: the types of tasks, their interdependencies, the decisions that kept getting lost. From that, I derived a set of structural rules, what goes where, when, and why, that could be documented, taught, and modified without requiring me to be present.",
          "Adoption was messy, honestly, but the underlying structure held up regardless. That's what I was aiming for: a process solid enough to keep working when people don't follow it to the letter. It's already outlived changes in the team, a round of new hires, and the stretches where nobody had time to babysit it. That's the real test, and it passed.",
        ],
        caption: "A good system keeps working when people don't follow it perfectly.",
      },
      es: {
        description: "El mejor proceso no depende de que una persona lo recuerde. Cómo aguantó en IKEA Home Services un sistema de trabajo basado en principios.",
        topic: "Sistemas Resilientes",
        title: "El mejor proceso es el que no depende de ninguna persona para ser recordado.",
        body: [
          "Cuando me uní al equipo de IKEA Home Services, no había ningún sistema de trabajo compartido. Los archivos existían en todas partes. La jerarquía del trabajo, qué iba en Figma, qué en Confluence, qué en Jira, era poco clara y se aplicaba de forma inconsistente. El proceso que existía dependía de personas concretas para mantenerlo en la memoria y transmitirlo informalmente. Cuando esas personas no estaban disponibles, el sistema se derrumbaba.",
          "Mi enfoque fue empezar con principios en lugar de herramientas. Mapeé el trabajo real que hacía el equipo: los tipos de tareas, sus interdependencias, las decisiones que se perdían continuamente. A partir de ahí, derivé un conjunto de reglas estructurales, qué va dónde, cuándo y por qué, que podían documentarse, enseñarse y modificarse sin que yo tuviera que estar presente.",
          "La adopción fue desordenada, la verdad, pero la estructura de fondo aguantó de todas formas. Y eso era justo lo que buscaba: un proceso lo bastante sólido como para seguir funcionando aunque la gente no lo siga al pie de la letra. Ya ha sobrevivido a cambios en el equipo, a una ronda de incorporaciones nuevas y a las temporadas en que nadie tenía tiempo de cuidarlo. Esa es la prueba de verdad, y la ha superado.",
        ],
        caption: "Un buen sistema sigue funcionando aunque la gente no lo siga a la perfección.",
      },
    },
    {
      slug: "ai-and-design-practice",
      en: {
        description: "With AI in the room, the bottleneck moves from generating options to making sense of them, and structuring that is design work.",
        topic: "AI &amp; Design Practice",
        title: "AI has changed how much of a design job is thinking versus doing, more than most people have noticed.",
        body: [
          "What I've been exploring over the past year is what happens when you introduce AI into a design process that was already complex, specifically, the Shape Up methodology my team uses at IKEA. Shape Up asks people to hold a lot of context, make judgment calls on incomplete information, and move quickly through shaping decisions that have long downstream consequences.",
          "AI can process and produce information faster than any team can absorb it. Which means the bottleneck shifts. The work moves from generating options to making sense of them: having enough shared context to evaluate what the AI has produced and decide what to do with it.",
          "The hard part turned out to be human: getting an AI-assisted process to produce output that's actually useful instead of just plentiful, building in checkpoints at the moments that actually need human judgment, and keeping a room full of people from getting buried in AI-generated text and losing track of the decision they were actually there to make.",
          "All of that is facilitation work. Which, it turns out, is design work too.",
        ],
        caption: "AI moves where judgment is needed. The bottleneck shifts from generation to sense-making, and structuring that process is a design problem.",
        link: { href: "/thinking/ai-workflow-framework/", label: "Read the full framework" },
      },
      es: {
        description: "Con IA en la sala, el cuello de botella pasa de generar opciones a darles sentido, y estructurar eso también es trabajo de diseño.",
        topic: "IA &amp; Práctica de Diseño",
        title: "La IA ha cambiado cuánto de un trabajo de diseño es pensar frente a ejecutar, más de lo que casi nadie ha notado.",
        body: [
          "Lo que he estado explorando durante el último año es qué ocurre cuando introduces la IA en un proceso de diseño que ya era complejo, concretamente, la metodología Shape Up que usa mi equipo en IKEA. Shape Up pide a las personas que mantengan mucho contexto, tomen decisiones de juicio con información incompleta y avancen rápidamente en decisiones de diseño que tienen consecuencias importantes más adelante.",
          "La IA puede procesar y producir información más rápido de lo que cualquier equipo puede absorberla. Lo que significa que el cuello de botella cambia. El trabajo pasa de generar opciones a darles sentido: tener suficiente contexto compartido para evaluar lo que la IA ha producido y decidir qué hacer con ello.",
          "Lo difícil de verdad resultó ser humano: conseguir que un proceso asistido por IA genere algo útil y no solo voluminoso, colocar los puntos de control justo donde hace falta el juicio humano, y evitar que una sala llena de gente se ahogue en texto generado por IA y pierda el hilo de la decisión que en realidad tenían que tomar.",
          "Todo eso es trabajo de facilitación. Y resulta que la facilitación también es diseño.",
        ],
        caption: "La IA cambia dónde hace falta el juicio. El cuello de botella pasa de la generación a la interpretación, y estructurar ese proceso es un problema de diseño.",
        link: { href: "/es/thinking/ai-workflow-framework/", label: "Leer el framework completo" },
      },
    },
  ],
};
