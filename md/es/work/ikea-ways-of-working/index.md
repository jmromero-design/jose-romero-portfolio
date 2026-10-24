# IKEA · Sistema de Formas de Trabajar · Jose Romero

Un framework de design ops para la New Business Platform de IKEA, entre Figma, Jira, Confluence y Phrase, pensado para funcionar sin su autor.

Source: https://www.joseromerodesign.com/es/work/ikea-ways-of-working/

Operaciones de Diseño · Sistemas · Facilitación

# Un proceso diseñado para sobrevivir a las personas.

Cuando me uní al equipo de IKEA Home Services, no había ningún sistema de trabajo compartido. Lo construí: un framework cross-tool abarcando Figma, Jira, Confluence y Phrase, desde los principios.

- **Cliente:** IKEA / Ingka Group

- **Agencia:** Garaje de Ideas / Groupe EDG

- **Mi rol:** Design Operations Lead

- **Período:** 2025–Presente

- **Alcance:** Diseño de Procesos · Documentación · Arquitectura de Herramientas · Diseño de Flujos IA · Facilitación

Arquitectura del Sistema WoW Framework de Decisión Skapa-First El problema

## Ocho puntos de fallo, no uno

Cuando me uní al equipo, el proceso de trabajo existía, pero solo en la cabeza de las personas. Los archivos estaban distribuidos por Figma, Confluence y unidades locales sin estructura consistente. Nadie podía decir con certeza qué iba en Figma, qué en Confluence o qué en Jira, y la respuesta cambiaba según a quién preguntaras.

Lo que parecía un problema cultural era en realidad estructural. Una auditoría de causas raíz detectó ocho puntos de fallo distintos que ralentizaban al equipo activamente. No eran independientes; cada uno alimentaba a los demás:

_Ocho puntos de fallo interconectados. El patrón subyacente: información retenida informalmente y ningún responsable de los huecos entre herramientas._

Enfoque

## Principios primero, herramientas después

El primer paso fue hacer legible el estado existente. Mapear lo que estaba ocurriendo realmente, no el ideal, no lo que la gente creía que pasaba, reveló que los problemas eran estructurales, no de comportamiento. Las personas no eran descuidadas; el sistema no tenía reglas claras sobre quién era responsable de qué en cada etapa.

Lo obvio es auditar primero las herramientas y luego escribir documentación alrededor de ellas, pero eso invierte el orden correcto. Sin un principio estructural detrás, la documentación es solo una cosa más que mantener actualizada.

Empecé mapeando el trabajo real: los tipos de tareas que realizaba el equipo, sus interdependencias, las decisiones que seguían perdiéndose, las preguntas que los nuevos miembros seguían haciendo. A partir de ese mapa, derivé un conjunto de reglas estructurales: qué tipo de información vive en cada herramienta, cuándo se mueve entre herramientas, quién la tiene en cada etapa.

"Figma es la fuente de la verdad de diseño. Confluence es la fuente de la verdad de contexto. Jira es la fuente de la verdad de progreso. Cuando algo existe en dos sitios sin una jerarquía clara, ya está roto."

Una vez que los principios fueron claros, la documentación se escribió sola. A las herramientas se les asignaron roles. Las convenciones de nomenclatura surgieron de esos roles. La incorporación de nuevos miembros surgió de las convenciones de nomenclatura.

El framework

## Cuatro herramientas, una columna vertebral

El framework asigna un rol único y no solapado a cada una de las cuatro herramientas principales. La regla es lo suficientemente simple como para retenerla en la memoria sin documentación:

_Una regla: cada herramienta tiene un trabajo. El sistema se mantiene porque el principio es lo suficientemente simple como para recordarlo sin la documentación._

_Artefacto de referencia operativa: la arquitectura completa del sistema WoW tal como se distribuyó al equipo. Cubre asignación de roles de herramientas, estructura de proyectos en Figma, jerarquía de librerías Skapa y el flujo de contenido en cinco fases en una única superficie de referencia._

El flujo de contenido

## Cinco fases. Dos responsables.

Junto al framework de herramientas, el equipo necesitaba un flujo claro para cómo el trabajo de diseño, especialmente el contenido y las traducciones, avanzaba por el ciclo de producción. El proceso existente no tenía fases definidas, ni transferencias de responsabilidad explícitas, ni ningún punto en el que las traducciones pudieran verificarse antes de llegar a los usuarios.

El flujo rediseñado se estructura en cinco fases con responsabilidades explícitas. Las fases uno a tres son responsabilidad del diseñador: se define el contenido, se configuran las claves de localización y se realiza el handoff. Las fases cuatro y cinco son responsabilidad de ingeniería: implementación, integración y QA ocurren aquí. El release es el resultado de un ciclo completo, no un deadline que comprime las fases anteriores.

El cambio estructural crítico estuvo en la Fase Dos. Las claves de localización, las cadenas que alimentan el sistema de traducción, tenían que crearse durante el diseño, no durante el desarrollo. Adelantar la creación de claves convirtió las traducciones en un track paralelo desde la Fase Dos, lo que significaba que estaban listas cuando comenzaba el QA.

_Cinco fases, dos responsables. El cambio estructural clave: claves de traducción configuradas en la Fase 2 (diseño), no en la Fase 4 (ingeniería), lo que las hace verificables en QA por primera vez._

_Artefacto de flujo a nivel de rama, cómo el proceso de cinco fases se traduce al trabajo diario en Figma: ciclo de vida de ramas desde su creación hasta su eliminación, convenciones de nombres, protocolo de handoff y reglas de integración con Jira en una vista operativa._

Marco de trabajo en Figma

## Decisiones de componentes, no caos de componentes.

La estructura de archivos y las convenciones de nombres resuelven el problema de organización. La gobernanza de componentes resuelve otro distinto: cuándo usar lo que ya existe, cuándo adaptarlo y cuándo proponer algo nuevo.

El sistema de diseño Skapa de IKEA proporciona una base sólida de iconos, fundamentos y componentes. Pero un equipo de producto que construye features para la Home App encontrará inevitablemente escenarios que Skapa no cubre. Sin una regla, esos huecos se rellenan de forma inconsistente: cada diseñador tomando una decisión diferente, sin trazabilidad ni revisión. El framework Skapa-First hace explícita la regla: consultar Skapa primero, adaptar si es necesario, y proponer nuevos componentes solo cuando ninguna solución existente sea viable, con justificación escrita y revisión de gobernanza antes de que cualquier componente entre en producción.

_Artefacto de gobernanza de componentes, el framework de decisión Skapa-First tal como se distribuye a los diseñadores. Tres rutas de evaluación: SÍ (usar directamente), QUIZÁS (adaptar como variante), NO (justificar y someter a revisión de gobernanza antes de producción)._

Optimización de Phrase

## De no verificable a comprobable

El flujo de traducción era el punto de fallo más agudo. En el estado existente, las claves de localización se creaban tarde en el ciclo, típicamente por ingeniería, no por diseño, lo que comprimía la ventana de traducción, forzaba que la localización ocurriera en paralelo con el desarrollo en lugar de antes, y dejaba al QA sin ningún mecanismo para verificar la calidad del idioma antes del release. Los errores de traducción los encontraban los usuarios finales, no el equipo.

El flujo rediseñado trasladó tanto la responsabilidad como el momento de creación de las claves. Los diseñadores crean las claves de contenido durante la Fase Dos, como parte del proceso de diseño, antes del handoff. Esto convierte la traducción en un track paralelo que está listo cuando finaliza el desarrollo. El control de calidad ahora incluye un paso dedicado a la revisión de traducciones: los errores de idioma son detectables antes de que lleguen a los usuarios.

"Un problema que no puedes probar antes del release es un problema que acabará publicado. Por eso hicimos las traducciones comprobables: era la única forma de sostener la calidad."

El cambio también redujo la carga cognitiva de ingeniería. Cuando las claves llegan al desarrollo ya creadas y nombradas correctamente, los ingenieros no toman decisiones de contenido bajo presión de plazo. El sistema produce mejor trabajo porque cada rol hace el trabajo para el que está posicionado.

Diseño de flujos IA

## Cuando el proceso es sólido, puedes diseñar lo que viene después.

Resolver los fallos estructurales era necesario. Pero también abrió una pregunta diferente: ahora que los handoffs y la responsabilidad eran explícitos y estaban documentados, ¿qué partes del flujo de diseño podían reestructurarse de forma fundamental, no solo mejorarse, usando IA?

De ahí surgieron dos líneas de trabajo:

Facilitación con Shape Up

Las sesiones de Shape Up son cognitivamente exigentes: definición del problema, restricciones, apetito y bocetos de solución, todo comprimido en pocas horas. Diseñé y probé flujos de facilitación que usan IA para apoyar el proceso de shaping: estructurando secuencias de prompts, ayudando a identificar casos límite antes de escribir los pitches, y sintetizando los outputs de múltiples participantes en documentación lista para pitch.

Orquestación multiagente para product shaping

Las features complejas suelen implicar a múltiples stakeholders: producto, ingeniería, contenido, negocio. Para esos casos, diseñé un enfoque multiagente que distribuye la tarea de shaping entre agentes especializados: descomposición del problema, mapeo de restricciones y evaluación de soluciones. Los outputs se estructuran para fluir directamente al formato de documentación de Confluence establecido por el sistema de formas de trabajar. El proceso y la capa de IA son el mismo sistema.

"La mayoría de los diseñadores cogen la IA como una herramienta más de la caja. Lo que hago aquí se parece más a diseñar la IA dentro del propio flujo de trabajo, otra habilidad, y la verdad es que hacia donde siempre apuntaba el pensamiento sistémico."

Este trabajo está en curso y se está compartiendo con profesionales senior de diseño en Garaje de Ideas como parte de un programa activo de formación en IA.

Resultado

## La adopción fue desigual, pero la estructura aguantó

La adopción ha sido desigual, como era de esperar. Algunos hábitos calaron enseguida, otros los va incorporando cada equipo a su ritmo, y todavía hay rincones del proceso que se resuelven informalmente en lugar de siguiendo el manual.

Lo que sí se ha mantenido es la estructura de fondo. Los nuevos miembros del equipo pueden incorporarse sin que nadie tenga que hacer de guía personal para cada herramienta. Los traspasos siguen una forma consistente. Y cuando el proceso falla, falla de formas reconocibles: una convención de nombres que alguien se saltó, una página de Confluence sin actualizar. Ambas se arreglan ajustando la documentación, no rebuscando en carpetas ni preguntando a la única persona que se acuerda.

El cambio en el flujo de traducción tuvo el efecto más inmediato: el QA pudo verificar la calidad del idioma antes del lanzamiento por primera vez. El ciclo de aviso pasó de "un usuario reporta un error de traducción" a "el QA lo pilla antes de salir a producción".

Y la verdad, me parece bien así. Prefiero un sistema que siga funcionando cuando la gente se salta pasos a uno que solo funciona si todo el mundo lo sigue al pie de la letra. Ese segundo tipo queda genial sobre el papel y se rompe el día que su única persona de confianza coge vacaciones.
