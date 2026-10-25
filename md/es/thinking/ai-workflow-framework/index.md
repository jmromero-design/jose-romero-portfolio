# Diseñar con IA · Jose Romero

Un framework para diseñar producto con personas al mando y agentes de apoyo: arquitectura de procesos, checkpoints reales, drift y lo que exige la IA.

Source: https://www.joseromerodesign.com/es/thinking/ai-workflow-framework/

Pensamiento · IA · Diseño de Procesos

# Diseñar con IA

Un framework para el diseño de producto liderado por humanos y asistido por agentes. Sobre arquitectura de procesos, checkpoints reales, drift y lo que la integración de IA exige verdaderamente.

**Operaciones de Diseño** · IKEA / Ingka Group · junio de 2026, actualizado en octubre de 2026 · Lectura de 18 min

**Tema**· Operaciones de Diseño**Contexto**· IKEA / Ingka Group**Publicado**· junio de 2026**Actualizado**· octubre de 2026**Lectura** · 18 min

Contenidos

- Prefacio

- El reencuadre

- La arquitectura

- Humano en el loop

- Facilitación

- Lo que exige

[← Caso de estudio](https://www.joseromerodesign.com/es/work/ai-workflow-framework/) [← Todas las reflexiones](https://www.joseromerodesign.com/es/thinking/)

## En resumen

- **Empieza por el flujo de trabajo.** Antes de elegir herramientas de IA, decide cómo se estructura el proceso y dónde deciden las personas. La IA añadida a un proceso desordenado solo acelera el desorden.

- **Tres niveles, cinco fases.** Un Orquestador mantiene el contexto del proyecto, los Agentes de Fase llevan Discovery, Shaping, Betting, Building y Retrospectiva, y Agentes de Tarea muy acotados hacen una sola cosa cada uno. Cada fase tiene criterios de salida.

- **Puntos de control que una persona tiene que superar.** Cada fase termina con un Bloque de Confirmación que una persona concreta lee con ojo crítico y aprueba. Releer la intención original en cada paso mantiene a raya la deriva.

- **Cambia el trabajo del diseñador.** Menos producción y más dirección, revisión y criterio. La responsabilidad sigue siendo de las personas, y quien facilita hace que el grupo cuestione lo que devuelve la IA.

Prefacio

La mayoría de los equipos de diseño con los que hablo se quedan atascados en la pregunta equivocada. "¿Qué herramienta de IA deberíamos usar?" es una pregunta de compras disfrazada de pregunta de diseño, y responderla primero es justo la razón por la que tantos equipos terminan con demos espectaculares, resultados que varían sin motivo aparente, y un proceso más difícil de auditar que el que tenían antes.

La pregunta más interesante es: si estuvieras diseñando un flujo de trabajo desde cero, sabiendo que los agentes de IA formarían parte de él, ¿cómo estructurarías el proceso? ¿Dónde estarían los humanos? ¿Qué harían realmente? ¿Qué gestionarían los agentes? ¿Y cómo sabrías si está funcionando?

Esa es la pregunta que este framework intenta responder. Surgió de trabajo real dentro del equipo de diseño de experiencia digital de IKEA, y se amplió después en algo que puede operar independientemente de cualquier conjunto de herramientas específico. Lo que sigue es el argumento completo, incluyendo las partes que fallaron antes de funcionar.

Diseño de procesos

## El reencuadre

La diferencia entre usar una herramienta y diseñar un flujo de trabajo tiene consecuencias reales. Una herramienta que usas es opcional e intercambiable. Una capa de flujo de trabajo que has diseñado forma parte de la arquitectura: perfil de riesgo diferente, nivel de cuidado diferente.

La mayoría de los equipos que he visto tratan la IA como una funcionalidad más, pegada encima del flujo de trabajo que ya tenían: un plugin de Figma que genera variantes de texto, una pestaña de ChatGPT resumiendo notas de investigación, un asistente escribiendo el primer borrador. Nada de eso está mal en sí mismo. El problema es que, usada así, la IA simplemente hereda lo que ya estaba roto en el proceso.

Si añades IA a un proceso improvisado, se vuelve más rápido y sigue siendo improvisado. Las decisiones que nunca se documentaron siguen sin documentarse, y ahora vuelven equivocadas y con mucha seguridad. Y si el equipo no se ha puesto de acuerdo en qué está intentando conseguir, la IA optimizará para otra cosa sin avisar.

La trampa es el resultado pulido: hace que un proceso poco claro parezca terminado.

Lo que funcionó fue tratar la IA como cualquier otro problema de diseño de sistemas: fijar los inputs, los outputs, los traspasos, quién decide qué y cuándo: el flujo de trabajo primero, con la IA diseñada dentro de él después, no al revés.

La pregunta útil dejó de ser "¿qué puede hacer la IA?" y pasó a ser "¿dónde encaja esto de verdad en el proceso, y cómo sabría yo si no estuviera funcionando?" Más lenta de responder, pero es la que importa.

Arquitectura de sistemas

## La arquitectura

El framework organiza el trabajo de diseño asistido por IA en tres niveles de agentes que operan en cinco fases.

### Los tres niveles

El apetito fijo y el alcance variable de Shape Up encajan bien aquí. El apetito limita la gestión de contexto del Orquestador. Los momentos de betting table se convierten en puntos de decisión reales, donde una persona tiene que elegir.

**Nivel 1: el Orquestador** ocupa la cúspide. Su trabajo es gestionar el contexto a lo largo de todo el proyecto: mantener el registro del proyecto, resumir los outputs de cada fase, coordinar los traspasos entre fases y escalar a los responsables de decisiones cuando algo es genuinamente ambiguo o relevante. El Orquestador gestiona las condiciones en las que se toman las decisiones de diseño; las decisiones siguen siendo de las personas.

**Nivel 2: Agentes de Fase** son propietarios de una única fase: Descubrimiento, Definición, Apuesta, Construcción o Retrospectiva. Reciben inputs del Orquestador, coordinan los Agentes de Tarea dentro de su fase y producen outputs estructurados para revisión humana al final de la fase.

**Nivel 3: Agentes de Tarea** son especialistas con alcance muy específico. Un agente de análisis de restricciones. Un agente de síntesis de necesidades de usuario. Un agente de registro de decisiones. Un agente de monitorización de alcance. Cada uno hace una sola cosa dentro de su fase y produce un output estructurado que alimenta directamente la síntesis del Agente de Fase. Esa especificidad es deliberada: un alcance pequeño significa responsabilidad clara, y un fallo queda contenido.

### Las cinco fases

Las fases siguen el ritmo central de la metodología Shape Up: el descubrimiento da forma al problema, la definición produce una propuesta, la apuesta compromete el alcance, la construcción lo ejecuta, y la retrospectiva hace evolucionar el propio framework. Cada fase tiene criterios de salida explícitos: condiciones que deben cumplirse antes de que el framework avance.

Esto importa porque previene el fallo más común en los flujos de trabajo asistidos por IA: fases que se completan técnicamente pero que no resuelven nada realmente. Los criterios de salida fuerzan la resolución. Evitan que la apariencia de progreso oculte su ausencia.

### Por qué importa la estructura

La jerarquía de tres niveles existe para contener. Un agente que opera con un mandato demasiado amplio derivará. Un agente que recibe inputs mal definidos alucinará de forma plausible. La jerarquía crea las condiciones bajo las cuales cada agente puede ser fiable: alcance claro, inputs bien formados, outputs estructurados y una capa de revisión humana en cada transición significativa.

La jerarquía crea las condiciones bajo las cuales cada agente puede ser fiable. Alcance claro, inputs bien formados, outputs estructurados y una capa de revisión humana en cada transición significativa.

Diseña bien el proceso y la IA queda como una capa más dentro de él.

Confianza y gobernanza

## Humano en el loop, de verdad

He dejado de fiarme de la frase "humano en el loop" por sí sola: cubre desde un rol de decisión real hasta un diálogo de confirmación que nadie lee antes de darle a aceptar. Muchos flujos de trabajo prometen supervisión humana y entregan un trámite.

Un output de IA con alta confianza es motivo para revisar con más cuidado. Un texto fluido también puede estar mal. Esto es contraintuitivo y vale la pena explicitarlo a todo el equipo.

El framework adopta una posición diferente: los checkpoints humanos deben ser puertas duras: momentos donde el flujo de trabajo literalmente no puede avanzar hasta que una persona concreta decida, con un registro de quién decidió y por qué. Una notificación o un correo de resumen no cuentan.

### Cómo es un checkpoint genuino

Cada transición de fase significativa requiere un Bloque de Confirmación: un output estructurado de IA que captura el entendimiento actual del agente sobre el problema, los supuestos que lleva adelante y las decisiones que permanecen abiertas. El trabajo del revisor es leerlo de forma adversarial: ¿qué está mal aquí? ¿Qué falta? ¿Qué ha cambiado?

Bloque de Confirmación Fase de Descubrimiento · Pendiente de revisión humana

Declaración del problema

Los usuarios en el flujo de onboarding abandonan en el paso de carga de documentos debido a la complejidad percibida y la incertidumbre sobre el manejo de datos. Señal primaria: analítica de abandono + grabaciones de sesiones de usabilidad (n=12).

Supuestos llevados adelante

Persona principal: usuarios primerizos con baja confianza técnica. Métrica de éxito: reducción del abandono en el paso de carga. Alcance: solo mobile nativo. Paridad con desktop no en este ciclo.

Decisiones diferidas

Si rediseñar la UI de carga o solo añadir orientación contextual. Requiere resolución humana antes de que comience la fase de Definición.

Preguntas abiertas

Aprobación legal del texto revisado sobre manejo de datos. Dependencia del equipo de backend para el calendario de validación de archivos.

→ Por favor confirma, corrige o amplía antes de que el flujo de trabajo avance.

Si una persona lee ese resumen y no tiene nada que corregir, yo lo tomaría como una señal amarilla. Puede que el agente haya capturado de verdad una fase bien estructurada. O puede que el revisor lo haya leído por encima. He aprendido a asumir lo segundo hasta que tenga motivos para pensar lo contrario.

### El problema del drift

Nadie habla del drift como modo de fallo, probablemente porque no se anuncia. Desde dentro, simplemente parece que el proyecto avanza.

El drift es la divergencia gradual entre el modelo de trabajo de la IA y la intención real del equipo. Es diferente de un error puntual, que es visible y corregible. El drift es acumulativo: pequeñas desalineaciones que se acumulan a través de las fases hasta que la brecha entre "lo que estamos construyendo" y "lo que dijimos que construiríamos" se vuelve significativa.

Se manifiesta como drift de encuadre (la declaración del problema cambia sutilmente), drift de persona (el usuario objetivo se aleja de la investigación), o drift de prioridades (las compensaciones resueltas antes se vuelven a ponderar silenciosamente). Cuando es visible, varias fases de trabajo pueden estar construidas sobre una base incorrecta.

Las defensas contra el drift son estructurales: un documento de contexto del proyecto actualizado y revisado en cada transición de fase; la intención original releída desde el documento escrito en cada gate de fase; y bloques de confirmación que sacan a la superficie el encuadre actual del problema del agente para comparación humana.

La defensa más importante es cultural: un entorno de equipo donde cuestionar el encuadre de la IA es esperado y recompensado.

### El contexto como disciplina de diseño

La arquitectura de contexto es diseño de información. Estructurar una interfaz compleja exige los mismos instintos: jerarquía, compresión, qué mostrar y qué diferir. Se transfieren directamente a la gestión del contexto en un sistema multi-agente.

Trabajar con modelos de lenguaje en un flujo de trabajo multifase significa aceptar una restricción real: los agentes no tienen memoria de la manera en que los miembros humanos del equipo sí la tienen. Cada uno opera dentro de una ventana de contexto: un espacio limitado de información que puede procesar activamente. Cuando esa ventana se llena, el contexto se resume, comprime o pierde.

Así se comporta la tecnología, y diseñar alrededor de eso resultó ser una habilidad en sí misma. El framework lo gestiona con cuatro mecanismos:

- **Inicialización del contexto**: un documento de proyecto vivo mantenido a través de todas las fases, reinyectado al inicio de cada fase

- **Resumen incremental**: compresión estructurada de los outputs de fase que preserva las decisiones y las preguntas abiertas

- **Inyección selectiva**: paquetes de contexto específicos por tarea que dan a cada agente solo lo que necesita para su alcance

- **Auditoría de contexto**: revisión liderada por humanos de la precisión del contexto en cada límite de fase

La habilidad de la arquitectura de contexto, saber qué información debe llevarse hacia adelante, cómo comprimirla sin perder señal, cuándo el contexto ha derivado de la realidad, es una de las habilidades más subestimadas en el trabajo de diseño aumentado por IA. También es una de las más enseñables.

Liderazgo y práctica

## Facilitación

Integrar la IA en un flujo de trabajo de diseño le da al facilitador un trabajo distinto.

El cambio más visible: el facilitador ya no es el procesador principal de información del grupo. La IA gestiona gran parte de la transcripción, el etiquetado y la síntesis preliminar. Esto libera atención, pero también crea nuevas demandas. El facilitador ahora vigila la sala y también el sistema, rastreando lo que la IA está haciendo con el input del grupo y preparando a los participantes para interactuar críticamente con esos outputs en lugar de pasivamente.

El patrón que he visto con más frecuencia: un grupo que ha estado en una sesión de dos horas acepta una síntesis de IA como autoritativa porque parece organizada. El facilitador necesita modelar el escepticismo, y seguir haciéndolo.

Hay un riesgo específico aquí. Cuando la IA resume un taller de dos horas en un conjunto de clusters de insights bien definidos, los participantes tienden a aceptar ese resumen como autoritativo, porque parece organizado y confiado. El facilitador debe resistir esto activamente: incitando al grupo a interrogar la síntesis, identificar qué se perdió en la compresión y sacar a la superficie los desacuerdos que el sistema puede haber suavizado.

El facilitador vigila la sala y el sistema a la vez. Y cuando los dos se contradicen, la sala gana.

### Lo que no cambia

- **Mantener el propósito**: la IA puede rastrear temas pero no puede mantener la intención. El facilitador es el propietario de por qué se realiza la sesión.

- **Leer la sala**: ningún modelo puede sentir cuándo un equipo está perdiendo confianza en el proceso, cuándo una voz está siendo sistemáticamente diferida, o cuándo el grupo está a punto de comprometerse con algo que realmente no entiende.

- **Juicios de valor**: cuando la síntesis de la IA contradice la lectura del facilitador de la sala, el juicio del facilitador tiene precedencia. Siempre.

### La norma que vale la pena proteger

La condición más importante para la facilitación aumentada por IA es una que no puede diseñarse en el sistema: la normalización del escepticismo hacia el output de la IA.

En los equipos que hacen esto bien, cuestionar el output del sistema se lee como alguien haciendo bien su trabajo. "No creo que esto recoja lo que realmente dijimos" vale mucho más que el silencio educado que suele recibir.

Construir esta norma requiere liderazgo explícito. El facilitador debe modelar el escepticismo: haciendo preguntas críticas sobre la síntesis de la IA frente al grupo, elogiando los desafíos y dejando claro que la IA es un colaborador con un rol definido y acotado, cuyo output siempre se revisa.

Habilidades y calibración

## Lo que esto exige

La integración de IA cambia el rol del diseñador.

Se dedica menos tiempo a la producción en sí: primeros borradores, síntesis estructurada, aplicar un patrón repetitivo una y otra vez; casi todo eso ha pasado a los agentes. Se dedica más tiempo a marcar dirección, evaluar lo que vuelve, e integrar entre fases, sobre todo en los juicios donde la necesidad del usuario, las restricciones del negocio y la calidad del diseño no encajan de forma limpia. La responsabilidad sobre el resultado no se ha movido ni un centímetro.

La responsabilidad sigue siendo del diseñador. Lo que cambia la IA es el trabajo necesario para cumplirla.

### Las habilidades con las que la educación en diseño aún no ha llegado

Los revisores cansados aceptan más. Incluye tiempo y estructura para la revisión cuidadosa en el proceso en sí. No confíes en la disciplina del equipo para hacer el trabajo que debería hacer el proceso.

- **Craft del prompt**: establecer la dirección para un agente con suficiente especificidad para guiar un output útil y suficiente apertura para permitir una contribución genuina. Esto se parece más a la escritura de briefs que a la especificación. La precisión importa más que la longitud.

- **Evaluación del output**: evaluar el output de IA crítica y rápidamente: qué es correcto, qué es incorrecto, qué necesita investigación. Esto requiere tanto conocimiento del dominio como un modelo mental claro de lo que el trabajo debe lograr.

- **Arquitectura de contexto**: decidir qué información debe llevarse adelante a través de las fases, cómo debe comprimirse y qué puede dejarse atrás de forma segura. Un nuevo tipo de diseño de información que los diseñadores senior están bien posicionados para desarrollar.

- **Detección de drift**: notar cuándo el encuadre de la IA ha cambiado sutilmente de la intención original. Esto requiere mantener la intención original visible y releerla regularmente desde el documento escrito.

- **Confianza calibrada**: saber cuándo el output de la IA es probablemente fiable y cuándo requiere un escrutinio más profundo. La calibración se desarrolla con la práctica y debe hacerse explícita en todo el equipo.

### El framework como práctica viva

Un framework tratado como terminado deja de mejorar. La fase de retrospectiva está específicamente diseñada para evitar esto: al final de cada ciclo, el equipo revisa el propio framework además del trabajo de diseño. Qué funcionó. Qué generó carga sin valor. Qué necesita cambiar.

Las prácticas descritas aquí son el resultado de una experimentación real: lo que ha funcionado, lo que ha fallado y lo que se ha aprendido. Describen dónde está la práctica hoy, y va a seguir cambiando. Cada equipo que adopte este framework encontrará situaciones que no aborda completamente. La respuesta correcta es adaptar el framework y dejar por escrito qué cambió.

Para cerrar

El framework es un intento de hacer el juicio humano más efectivo. La capa de IA existe para servir al proceso. El proceso existe para servir al diseño. El diseño existe para servir a las personas que lo usan.

Los agentes, el flujo de trabajo, las herramientas: nada de eso importa tanto como que esa cadena de responsabilidad aguante de principio a fin. Ese es el punto real.

[← Volver al Pensamiento](https://www.joseromerodesign.com/es/thinking/) [Ver el caso de estudio →](https://www.joseromerodesign.com/es/work/ai-workflow-framework/)
