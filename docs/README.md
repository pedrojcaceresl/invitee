# MAC (Multi-Agent Coordination) aplicado a Invitee

Basado en los conceptos de coordinación de agentes descritos en [Tacnode — Agent Coordination](https://tacnode.io/post/multi-agent-coordination), adaptados a la escala real de este proyecto: un desarrollador (vos) orquestando varios agentes IA (probablemente sesiones de Claude Code) que no corren todas al mismo tiempo, sino que se invocan una a la vez según el rol que toca.

## 1. Por qué coordinación centralizada
El artículo describe varias estrategias: centralizada, basada en mercado (bidding), votación, jerárquica. Para este proyecto, **centralizada** es la elección correcta: hay un solo Coordinador, pocos roles, y el overhead de coordinar es bajo comparado con el trabajo de cada agente. Bidding o votación tienen sentido cuando hay *muchos* agentes compitiendo por tareas — acá no es el caso. Si más adelante corrés 2 Implementadores en paralelo sobre tareas independientes (ej. Iteración 3 y 4 al mismo tiempo), seguís centralizado: el Coordinador simplemente reparte, no hace falta que los Implementadores negocien entre sí.

## 2. Capa de coordinación: archivos, no infraestructura en vivo
El artículo distingue tres protocolos de comunicación: memoria compartida, colas de mensajes, llamadas directas agente-a-agente. Ninguno aplica tal cual acá, porque los agentes son **sesiones efímeras** (abrís un chat, hace su trabajo, se cierra), no procesos siempre corriendo.

El equivalente práctico es lo que el artículo llama **stigmergy**: comunicación indirecta a través de estado compartido. Un agente deja su resultado escrito en un archivo; el siguiente agente lo lee y construye sobre eso, sin necesidad de hablar directamente entre ellos.

**La capa de coordinación de este proyecto es la carpeta `/docs/mac/` del repo:**
- `task-board.md` — estado compartido (qué tarea, en qué estado, quién la tiene)
- `spec-invitee.md` y `adr-001-capa-de-datos.md` — la "fuente de verdad" que todos los roles consultan
- Los archivos de rol (`coordinador.md`, `implementador.md`, `reviewer.md`, `tester.md`) — el prompt/instrucciones de cada agente

## 3. Roles (agent layer)
| Rol | Qué hace | Qué NO hace |
|---|---|---|
| **Coordinador** | Descompone la iteración activa en tareas, las asigna, detecta tareas estancadas, escala ambigüedad a vos | No escribe código, no revisa código |
| **Implementador** | Toma una tarea, la implementa siguiendo spec + ADR-001 | No decide arquitectura nueva, no aprueba su propio trabajo |
| **Reviewer** | Revisa el código contra spec/ADR, aprueba o rechaza con feedback concreto | No corrige el código directamente |
| **Tester** | Corre/escribe los tests definidos en el spec para esa tarea, confirma "Definición de Hecho" | No implementa fixes, solo reporta pass/fail |

Separar Implementador de Reviewer es deliberado: el artículo señala que la consistencia mejora cuando agentes evalúan el trabajo de otro en vez de validar el propio (mismo principio que está detrás de los mecanismos de consenso).

## 4. Ciclo de vida de una tarea
```
Pendiente → Asignada → En implementación → En revisión → En testing → Hecha
                ↑                              |              |
                └──────── Rechazada ←───────────┴──────────────┘
```
- **Rechazada** por Reviewer o Tester vuelve a **Asignada**, con el motivo escrito en `task-board.md`. No es una falla del sistema, es el flujo normal.

## 5. Mecanismo de decisión: consenso 2-de-2
Una tarea pasa a "Hecha" solo si Reviewer **y** Tester la aprueban, de forma independiente. Si alguno rechaza, vuelve a Implementador. Esto es el patrón de **consenso** del artículo aplicado a escala mínima — reduce el riesgo de que un solo agente (con alucinaciones o sesgos propios) marque algo como terminado sin estarlo.

## 6. Fault tolerance adaptada a sesiones efímeras
El artículo asume agentes que corren continuamente y pueden caerse o colgarse. Acá el equivalente es: una sesión se cierra sin actualizar el estado, o un agente interpreta mal la tarea y hay que reintentar.
- **Idempotencia:** cada tarea debe poder reintentarse sin duplicar trabajo. Usar el ID de la tarea como nombre de branch/commit, no inventar nombres distintos en cada intento.
- **Detección de tareas estancadas:** si una tarea queda "En implementación" sin actualizarse por mucho tiempo, el Coordinador la marca como estancada y decide si reabrirla o reasignarla.
- **Aislamiento de fallos:** un Implementador que produce algo incorrecto no debe contaminar el trabajo de otras tareas — por eso cada tarea es una unidad independiente en el task-board, no un estado global compartido sin estructura.

## 7. Checkpoints humanos (vos)
Según el artículo, las tareas de alto impacto necesitan supervisión humana en puntos definidos, no autonomía total. Para este proyecto, esos puntos son:
- **Antes de que el Coordinador arranque una iteración nueva** — revisás la descomposición en tareas antes de que se ejecute.
- **Antes de mergear a `main`** — el consenso Reviewer+Tester no reemplaza tu aprobación final.
- **Cualquier decisión que toque la arquitectura** (ej. algo que contradiga ADR-001) se escala directo a vos, no se resuelve entre agentes.

## 8. Escalado futuro (no para el MVP)
Si en algún momento corrés varios Implementadores en paralelo sobre tareas independientes, no hace falta cambiar de estrategia — el Coordinador sigue centralizando la asignación, solo reparte más de una tarea a la vez. Recién si llegás a tener *muchos* agentes compitiendo por trabajo tendría sentido evaluar bidding (mercado) en vez de asignación directa.
