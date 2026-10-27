# Un grafo que califica su propia evidencia · Jose Romero

Un grafo con más de 450 fuentes verificadas por DOI para separar lo que muestra la investigación de lo que repiten las presentaciones de diseño.

Source: https://www.joseromerodesign.com/es/thinking/beco-knowledge-graph/

Infraestructura de Investigación Personal · Trabajo en Curso

# Un grafo de conocimiento que _califica su propia evidencia._

Cuatrocientas veinte fuentes. Cada una verificada por DOI. Construido para separar lo que la ciencia del comportamiento realmente demuestra de lo que las presentaciones de diseño llevan una década repitiendo.

Por qué existe esto

## “Nudge” se convirtió en una palabra antes de convertirse en una disciplina.

El vocabulario de la economía del comportamiento se extiende por el diseño más rápido que su evidencia. Las “leyes” con nombre propio se citan en presentaciones, guías de estilo y documentación de diseño, y casi nadie comprueba si la investigación detrás de ellas realmente se sostiene.

Ley de Jakob? Ley de Murphy? Navaja de Occam? Ley de Hick? Ley de la Trivialidad?

Este grafo existe para responder esa pregunta, para cada una de ellas, dejándolo por escrito, y para mantener la respuesta al día conforme aparece nueva evidencia.

La idea central

## Tres niveles. _Una sola dirección._

### La Ciencia

Fuente → Hallazgo. Verificado por DOI, calificado como replicado, disputado, no determinado o no aplicable.

Respaldado por

### La Calificación de Confianza

Sesgo con nombre. Un estado de respaldo honesto y una calificación de riesgo de mito aparte, independiente de cuán popular sea la afirmación.

Ilustrado por

### La Práctica

Aplicación. Productos, campañas y estudios reales, calificados por procedencia, con una lectura ética obligatoria.

La flecha solo corre en una dirección. Un ejemplo real puede ilustrar un sesgo. Nunca puede inflar la calificación que tiene encima. La popularidad en la práctica y el rigor en la investigación permanecen separados, de forma visible y permanente.

De un vistazo

## No es un _prototipo._

452Fuentes 465Hallazgos 254Conceptos con Nombre 221Temas 960Autores 227Ejemplos Reales

Alojado en Neo4j Aura, siempre activo y accesible desde cualquier lugar, no un archivo local en un solo portátil.

Cómo está construido

## Un mapa, _no una hoja de cálculo._

Lo que realmente lo hace confiable

## La regla es simple. _Sostenerla es lo difícil._

Cada fuente necesita un DOI real y verificable. Cada hallazgo recibe una de cuatro calificaciones — replicado, disputado, no determinado o no aplicable — nunca solo “citado”. Cada escritura a la base de datos en producción pasa primero por una validación antes de tocar nada. Los campos son de opciones cerradas, no texto libre, así que “más o menos respaldado, supongo” nunca fue una opción posible.

Esa disciplina es todo el punto. Elegir citas que suenen autorizadas es fácil. Sostener un criterio consistente sobre qué cuenta realmente como evidencia, y dejarlo por escrito cada vez, es la parte que casi siempre se salta.

Verlo funcionar

## Principio de Escasez, _de principio a fin._

Fuente Tácticas de escasez en marketing Journal of Retailing, 2022 → Hallazgo 416 tamaños de efecto, 131 estudios Las señales de escasez aumentan de forma consistente la intención de compra, moderadas por el tipo de producto. → Sesgo con nombre Principio de Escasez Verificado · sin riesgo de mito → Aplicación Los mensajes de urgencia de Booking.com Caso real · aclarado tras la intervención regulatoria de la UE en 2020

Cada eslabón de esa cadena es una cita real, verificable de forma independiente, no una paráfrasis de “la investigación demuestra”.

Prueba de que no es solo archivar

## Cuando la evidencia no existe, _el grafo lo dice._

Aplicar la misma auditoría sobre quince “leyes” ampliamente citadas — entre ellas la ley de Murphy, la navaja de Occam, la ley de Jakob y la ley de la trivialidad — no encontró ningún respaldo riguroso detrás de ninguna de ellas. Eso no significa que la observación de fondo esté equivocada. Significa que la evidencia que normalmente se le atribuye no aparece cuando uno realmente va a buscarla.

1 reversión La afirmación de que los ganadores de lotería no son más felices que el resto, citada en casi todo argumento de “el dinero no da la felicidad”, está directamente disputada por una corrección de 2020 sobre un error de medición en el estudio original. 17%, no 17 puntos Un estudio sobre el sesgo de resultado en entrenadores de la NBA se citaba diciendo que eran “17 puntos porcentuales” más propensos a cambiar de alineación tras una derrota. La fuente dice en realidad 17 por ciento, un cambio relativo. Se revisó contra el DOI original y se corrigió para que coincida. Útil, no solo preciso

## Una respuesta confiable que _nadie encuentra_ no es confiable.

Búsqueda semántica sobre los hallazgos, medida contra un conjunto de preguntas reales etiquetadas, no evaluada a ojo. La configuración en producción supera a dos alternativas razonables por un margen real.

ConfiguraciónMRRHit@1

Producción (con prefijo de instrucción)0.8110.733

Ablación · sin prefijo de instrucción0.6600.567

Ablación · otro modelo de embeddings0.7510.667

Un resultado cambió un enfoque que ya estaba en producción: un paso de reordenamiento que mejora claramente la búsqueda sobre los hallazgos empeora la búsqueda sobre los sesgos con nombre. Una técnica que funciona para una parte de un sistema no funciona automáticamente en otra parte solo porque sea el mismo sistema.

No es solo una base de datos

## Hazle _una pregunta._

$ python3 query.py "¿de verdad funciona la escasez?" Principio de Escasez · verificado · fundamental La disponibilidad limitada aumenta el valor y el deseo percibidos. Ejemplos reales (4): • Los mensajes de urgencia de Booking.com · riesgo de uso manipulador señalado • El encuadre combinado de tiempo y cantidad limitados de Groupon categorize.py

La auditoría por nivel de confianza: qué se sostiene, qué está en disputa, y qué “leyes” populares cargan un riesgo de mito real.

query.py

Búsqueda semántica sobre los hallazgos y los sesgos con nombre, con disputas, respaldos y procedencia completa de la fuente en un solo resultado.

Neo4j Aura

Siempre activo, consultable desde cualquier lugar, no un archivo local que alguien tiene que pedir acceso para ver.

Trabajo en curso, a propósito

## Construido para crecer. _Construido para ser revisado._

Ahora mismo, esto es mío: yo lo consulto, yo lo mantengo, soy el único que ha escrito en él alguna vez. El trabajo actual es de profundidad, no de amplitud: ampliar la cobertura de fuentes en los nombres más citados y más fundamentales del corpus, para que los conceptos en los que más se apoyan los profesionales descansen sobre más de un solo estudio.

Quería que otros diseñadores pudieran explorar esto por sí mismos en lugar de fiarse de mi palabra sobre lo que contiene, así que ahora existe una versión navegable de todo el grafo: los mismos clústeres, las mismas citas, sin selección editorial de por medio. Es una instantánea, no una conexión en vivo, y de solo lectura por ahora. Cualquiera que trabaje en este campo ya puede abrir una afirmación y ver exactamente qué la respalda; dejar que otros escriban en él es la parte que todavía falta.

✓ 202 ejemplos reales en todos los dominios ✓ Búsqueda ajustada y medida, no asumida ✓ Abierto para que cualquiera lo explore → Ampliando la profundidad de literatura en los nombres fundamentales Ponte en contacto

## Si alguna vez citaste una “ley” que nunca comprobaste, _no estás solo._

Por eso exactamente construí esto. Siempre estoy dispuesto a hablar de lo que respalda una afirmación concreta, recorrer el grafo directamente, o escuchar sobre una fuente que me falta.

[Explora el grafo →](https://www.joseromerodesign.com/es/thinking/beco-explorer/) [Ponte en contacto →](mailto:joseromero.next@gmail.com)
