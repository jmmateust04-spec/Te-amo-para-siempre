import { useState, useMemo, useCallback } from "react";

/* ---------------------------------------------------------
   BANCO DE PREGUNTAS
--------------------------------------------------------- */

const MC_BANK = [
  {
    id: "mc1",
    prompt:
      "¿Cuál de las siguientes entidades constituye el ente rector principal del Sistema General de Seguridad Social en Salud, en virtud de una responsabilidad indelegable del Estado?",
    options: [
      "Instituto Nacional de Salud (INS)",
      "Ministerio de Salud y Protección Social",
      "Superintendencia Nacional de Salud",
      "Secretarías de Salud departamentales",
    ],
    correctIndex: 1,
    justification:
      "La rectoría del sistema es una responsabilidad indelegable del Estado, ejercida por el Ministerio de Salud y Protección Social como rector principal. El INS, el INVIMA, el ICBF y las Secretarías de Salud participan únicamente de forma secundaria en esta función; ninguno de ellos sustituye al Ministerio como cabeza de la rectoría.",
  },
  {
    id: "mc2",
    prompt:
      "La actividad de 'conducir y alinear la cooperación internacional en salud con las prioridades y objetivos nacionales' pertenece al grupo de actividades de la rectoría relacionado con:",
    options: [
      "El análisis de la situación de salud",
      "La formulación de estrategias y programas de salud",
      "La proyección internacional y la evaluación del desempeño del sistema",
      "La participación y el control social en salud",
    ],
    correctIndex: 2,
    justification:
      "Las actividades 7, 8 y 9 de la función de rectoría (cooperación internacional, participación en organismos internacionales y subregionales, y evaluación del desempeño del sistema) conforman el grupo de proyección internacional y evaluación, diferenciado del grupo analítico-estratégico que agrupa las actividades 1 a 6.",
  },
  {
    id: "mc3",
    prompt:
      "Un organismo de control detecta, a partir de la información recopilada, que un prestador incumple sistemáticamente sus obligaciones de reporte, y le comunica formalmente esta situación sin ordenar todavía ninguna sanción. ¿Qué facultad se está ejerciendo?",
    options: ["Inspección", "Vigilancia", "Control", "Habilitación"],
    correctIndex: 1,
    justification:
      "La vigilancia es la facultad de advertirle a alguien que está incumpliendo sus obligaciones. Se diferencia de la inspección, que es la facultad de pedir y acopiar información, y del control, que implica ordenar los correctivos necesarios y sancionar al incumplido.",
  },
  {
    id: "mc4",
    prompt:
      "¿Cuál de las siguientes organizaciones ejerce inspección, vigilancia y control desde una posición EXTERNA al Sistema General de Seguridad Social en Salud?",
    options: [
      "Superintendencia Nacional de Salud",
      "INVIMA",
      "Contraloría General de la República",
      "Instituto Nacional de Salud",
    ],
    correctIndex: 2,
    justification:
      "La Procuraduría General de la Nación y la Contraloría General de la República son organizaciones externas al sistema que ejercen inspección, vigilancia y control. La Superintendencia Nacional de Salud, el INVIMA, el Instituto Nacional de Salud y las Secretarías de Salud son organizaciones internas al sistema.",
  },
  {
    id: "mc5",
    prompt:
      "¿Cuál de las siguientes opciones corresponde a uno de los cuatro componentes del Sistema Obligatorio de Garantía de Calidad, y no a uno de los siete estándares de capacidad técnico-científica?",
    options: [
      "Talento humano",
      "Auditoría para el mejoramiento de la calidad",
      "Historia clínica",
      "Dotación",
    ],
    correctIndex: 1,
    justification:
      "Los cuatro componentes del Sistema Obligatorio de Garantía de Calidad son: el sistema único de habilitación, el sistema único de acreditación, la auditoría para el mejoramiento de la calidad y el sistema de información de la calidad. El talento humano, la historia clínica y la dotación son estándares dentro de las condiciones de capacidad técnico-científica, que a su vez forman parte del componente de habilitación.",
  },
  {
    id: "mc6",
    prompt:
      "Según el ciclo de habilitación visto en clase, ¿cuál es la periodicidad correcta de la visita de verificación realizada por la Secretaría de Salud, en contraste con la autoevaluación (CREPS)?",
    options: [
      "Ambas se realizan cada año",
      "La visita de verificación cada 4 años y la autoevaluación cada año",
      "La visita de verificación cada año y la autoevaluación cada 4 años",
      "Ambas se realizan cada 2 años",
    ],
    correctIndex: 1,
    justification:
      "Las visitas de verificación, realizadas por la Secretaría de Salud, se hacen cada 4 años. De forma independiente, cada año el prestador debe realizar una autoevaluación (CREPS), lo que constituye un ciclo de control con dos periodicidades distintas y complementarias.",
  },
];

const OPEN_BANK = [
  {
    id: "op1",
    block: "Rectoría del sistema",
    prompt:
      "La rectoría del sistema se define como una responsabilidad indelegable del Estado. Explique qué implicaciones tiene este carácter indelegable para la relación entre el Ministerio de Salud y Protección Social y los entes secundarios (INS, INVIMA, ICBF, Secretarías de Salud).",
    justification:
      "El carácter indelegable significa que, aunque el Ministerio se apoye en entes secundarios para ejecutar tareas específicas y especializadas (vigilancia epidemiológica, control de medicamentos, protección de la infancia o gestión territorial), la titularidad y la responsabilidad última de dirigir el sistema no puede transferirse ni diluirse en esas entidades. Los entes secundarios complementan y operacionalizan la rectoría, pero no la sustituyen: el Ministerio conserva la conducción estratégica (análisis, definición de prioridades, formulación de políticas y evaluación del sistema), mientras que los entes secundarios actúan como brazos ejecutores especializados dentro de ese marco.",
  },
  {
    id: "op2",
    block: "Rectoría del sistema",
    prompt:
      "Las nueve actividades de la función de rectoría se agrupan en un bloque analítico-estratégico (actividades 1 a 6) y un bloque internacional y de evaluación (actividades 7 a 9). Argumente por qué esta distinción tiene sentido lógico dentro del ejercicio de la rectoría.",
    justification:
      "El primer bloque constituye el ciclo interno de gobierno del sistema: analizar la situación de salud, definir prioridades, formular y monitorear políticas, movilizar actores y recursos, promocionar la salud y asegurar la participación social — es decir, el conjunto de decisiones y acciones que el rector toma puertas adentro del sistema. El segundo bloque proyecta esa rectoría hacia afuera (cooperación y participación en organismos internacionales) y, a la vez, cierra el ciclo mediante la evaluación del desempeño del sistema, actividad que retroalimenta el bloque analítico-estratégico. La distinción refleja, entonces, una lógica de gestión interna seguida de proyección externa y retroalimentación, no una simple enumeración arbitraria.",
  },
  {
    id: "op3",
    block: "Rectoría del sistema",
    prompt:
      "Compare la actividad de 'asegurar la participación y el control social en salud' (actividad 6 de la rectoría) con la función 7 de Inspección, Vigilancia y Control. ¿Por qué estas dos funciones, aunque ambas implican supervisión, no deben confundirse?",
    justification:
      "La actividad de asegurar la participación y el control social forma parte de la función de rectoría y se refiere a garantizar canales democráticos para que la ciudadanía participe e incida en las decisiones del sistema; es una responsabilidad del Ministerio como conductor del sistema. La función 7, en cambio, es una función indispensable distinta, ejercida principalmente por la Superintendencia Nacional de Salud y otras entidades, que otorga facultades formales de inspección, vigilancia y control —con capacidad de acopiar información, advertir incumplimientos y sancionar— sobre los actores del sistema. Mientras la primera es un mecanismo de participación ciudadana enmarcado en la rectoría, la segunda es una función institucional de supervisión con poder sancionatorio, ejercida por organismos distintos y con una facultad jurídica diferente.",
  },
  {
    id: "op4",
    block: "Inspección, Vigilancia y Control",
    prompt:
      "Explique por qué inspección, vigilancia y control constituyen una secuencia lógica de facultades y no simples sinónimos intercambiables. Ilustre la secuencia con base en las definiciones vistas en clase.",
    justification:
      "Las tres facultades siguen un orden lógico de dependencia: primero, la inspección permite pedir y acopiar la información necesaria para conocer la situación de un actor del sistema; con base en esa información, la vigilancia permite advertirle a ese actor que está incumpliendo sus obligaciones; y solo después de esa advertencia, el control permite ordenar los correctivos necesarios y sancionar al incumplido. No es posible vigilar sin haber inspeccionado previamente, ni controlar sin haber vigilado, por lo que las tres facultades constituyen etapas sucesivas de un mismo proceso de supervisión, y no términos equivalentes que puedan usarse indistintamente.",
  },
  {
    id: "op5",
    block: "Inspección, Vigilancia y Control",
    prompt:
      "La Superintendencia Nacional de Salud es la organización interna principal en la función de Inspección, Vigilancia y Control, pero coexiste con otras entidades internas de menor escala y con entidades externas al sistema. Argumente qué justifica la existencia de estas múltiples instancias, en lugar de concentrar toda la función en un solo organismo.",
    justification:
      "La coexistencia de varias instancias responde a la necesidad de complementar una vigilancia general (a cargo de la Superintendencia) con vigilancias especializadas: el INVIMA sobre medicamentos y alimentos, el Instituto Nacional de Salud sobre la vigilancia epidemiológica, y las Secretarías de Salud en el nivel territorial. A esto se suman las entidades externas al sistema —Procuraduría y Contraloría—, que aportan un control disciplinario y fiscal independiente del sector salud. Esta distribución evita concentrar toda la capacidad de inspección, vigilancia y control en un único organismo, distribuye la carga de supervisión según la complejidad y escala del sistema, y añade un nivel de control externo que actúa como contrapeso institucional.",
  },
  {
    id: "op6",
    block: "Inspección, Vigilancia y Control",
    prompt:
      "A partir del esquema de las siete funciones indispensables en todo sistema de salud, explique la relación entre la función 5 (Articulación) y las funciones 6 (Rectoría) y 7 (Inspección, Vigilancia y Control).",
    justification:
      "En el esquema visto en clase, la función de Articulación ocupa el centro y conecta a las demás funciones (demanda, prestación de servicios, regulación, financiación, rectoría e inspección, vigilancia y control). La rectoría define la dirección estratégica del sistema, mientras que la inspección, vigilancia y control supervisa que esa dirección se cumpla efectivamente; sin una función de articulación que coordine ambas con el resto del sistema, la rectoría podría formular políticas desconectadas de la operación real, y la función de IVC podría supervisar sin relación con las prioridades definidas por el rector. La articulación es, entonces, el engranaje que asegura que la conducción (rectoría) y la supervisión (IVC) operen de manera coherente con la demanda, la prestación, la regulación y la financiación del sistema.",
  },
  {
    id: "op7",
    block: "Sistema Obligatorio de Garantía de Calidad",
    prompt:
      "El apunte de clase vincula el principio de 'no hacer daño' con la obligación de preguntar al paciente si desea o no someterse a un procedimiento médico. Explique cómo este principio se articula con los cuatro componentes del Sistema Obligatorio de Garantía de Calidad.",
    justification:
      "El principio de 'no hacer daño', orientado a brindar seguridad al paciente, es el fundamento que da sentido a los cuatro componentes del Sistema Obligatorio de Garantía de Calidad: la habilitación garantiza que el prestador cuente con las condiciones mínimas de seguridad antes de atender pacientes; la acreditación, de carácter voluntario, impulsa un nivel de calidad superior al mínimo habilitante; la auditoría para el mejoramiento de la calidad revisa y corrige continuamente los procesos asistenciales; y el sistema de información de la calidad recopila y monitorea datos que permiten detectar riesgos para el paciente. La obligación de consultar al paciente si desea o no realizarse el procedimiento es una expresión concreta de la buena calidad de la atención, cuyo cumplimiento es precisamente lo que se constata en la visita de verificación.",
  },
  {
    id: "op8",
    block: "Sistema Obligatorio de Garantía de Calidad",
    prompt:
      "Explique la diferencia funcional entre las condiciones de capacidad técnico-científica (los siete estándares) y el Registro Especial de Prestadores de Servicios de Salud (REPS), y cómo ambos se integran en la visita de verificación realizada por la Secretaría de Salud.",
    justification:
      "Las condiciones de capacidad técnico-científica —talento humano, infraestructura, dotación, medicamentos, procesos asistenciales, historia clínica e interdependencia— son los requisitos sustantivos que un prestador debe cumplir realmente para operar con seguridad; constituyen el 'qué' de la calidad habilitante. El REPS, en cambio, es el registro administrativo donde formalmente queda consignada la habilitación del prestador; constituye el 'dónde' se deja constancia de ese cumplimiento. Ambos se integran en la visita de verificación, realizada por la Secretaría de Salud, la cual coteja la Resolución 3100 de 2019, el REPS y la 'vida real' del prestador —es decir, contrasta lo declarado en el registro y lo exigido por la norma frente a lo que efectivamente se observa en el sitio— para constatar que el cumplimiento sea real y no solamente documental.",
  },
];

/* ---------------------------------------------------------
   UTILIDADES
--------------------------------------------------------- */

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMcRuntime() {
  const order = shuffle(MC_BANK);
  return order.map((q) => {
    const optIdx = shuffle(q.options.map((_, i) => i));
    const options = optIdx.map((origIdx) => q.options[origIdx]);
    const correctIndex = optIdx.indexOf(q.correctIndex);
    return { ...q, options, correctIndex };
  });
}

function buildOpenRuntime() {
  return shuffle(OPEN_BANK);
}

const LETTERS = ["A", "B", "C", "D"];

/* ---------------------------------------------------------
   COMPONENTE PRINCIPAL
--------------------------------------------------------- */

export default function Exam() {
  const [phase, setPhase] = useState("start"); // start | mc | open | done
  const [mcQuestions, setMcQuestions] = useState(() => buildMcRuntime());
  const [openQuestions, setOpenQuestions] = useState(() => buildOpenRuntime());
  const [mcAnswers, setMcAnswers] = useState({});
  const [openIndex, setOpenIndex] = useState(0);
  const [openAnswers, setOpenAnswers] = useState({});
  const [openRevealed, setOpenRevealed] = useState({});
  const [confirmingReset, setConfirmingReset] = useState(false);

  const allMcAnswered =
    mcQuestions.length > 0 &&
    mcQuestions.every((q) => mcAnswers[q.id] !== undefined);

  const mcScore = useMemo(() => {
    return mcQuestions.reduce(
      (acc, q) =>
        acc + (mcAnswers[q.id] !== undefined && mcAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
  }, [mcQuestions, mcAnswers]);

  const mcAnsweredCount = useMemo(
    () => mcQuestions.filter((q) => mcAnswers[q.id] !== undefined).length,
    [mcQuestions, mcAnswers]
  );

  const resetAll = useCallback(() => {
    setMcQuestions(buildMcRuntime());
    setOpenQuestions(buildOpenRuntime());
    setMcAnswers({});
    setOpenIndex(0);
    setOpenAnswers({});
    setOpenRevealed({});
    setPhase("start");
    setConfirmingReset(false);
  }, []);

  const currentOpen = openQuestions[openIndex];
  const currentOpenAnswer = currentOpen ? openAnswers[currentOpen.id] ?? "" : "";
  const currentOpenRevealed = currentOpen ? !!openRevealed[currentOpen.id] : false;

  return (
    <div className="exam-root">
      <style>{CSS}</style>

      <header className="exam-header">
        <span className="exam-header-title">Examen de preparación diseñado para Luciana Nassif</span>
        {phase !== "start" && (
          <div className="reset-wrap">
            {!confirmingReset ? (
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmingReset(true)}
              >
                Reiniciar examen
              </button>
            ) : (
              <div className="reset-confirm">
                <span>¿Reiniciar y reordenar todo?</span>
                <button className="btn btn-tiny btn-solid" onClick={resetAll}>
                  Sí, reiniciar
                </button>
                <button
                  className="btn btn-tiny btn-ghost"
                  onClick={() => setConfirmingReset(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="exam-main">
        {phase === "start" && (
          <StartScreen onStart={() => setPhase("mc")} />
        )}

        {phase === "mc" && (
          <McSection
            questions={mcQuestions}
            answers={mcAnswers}
            score={mcScore}
            answeredCount={mcAnsweredCount}
            allAnswered={allMcAnswered}
            onSelect={(qid, idx) =>
              mcAnswers[qid] === undefined &&
              setMcAnswers((prev) => ({ ...prev, [qid]: idx }))
            }
            onContinue={() => setPhase("open")}
          />
        )}

        {phase === "open" && currentOpen && (
          <OpenSection
            question={currentOpen}
            index={openIndex}
            total={openQuestions.length}
            value={currentOpenAnswer}
            revealed={currentOpenRevealed}
            onChange={(text) =>
              setOpenAnswers((prev) => ({ ...prev, [currentOpen.id]: text }))
            }
            onSubmit={() =>
              setOpenRevealed((prev) => ({ ...prev, [currentOpen.id]: true }))
            }
            onNext={() => {
              if (openIndex + 1 < openQuestions.length) {
                setOpenIndex((i) => i + 1);
              } else {
                setPhase("done");
              }
            }}
          />
        )}

        {phase === "done" && <DoneScreen mcScore={mcScore} mcTotal={mcQuestions.length} onReset={resetAll} />}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------
   PANTALLAS
--------------------------------------------------------- */

function StartScreen({ onStart }) {
  return (
    <section className="card start-card">
      <p className="start-copy">
        La prueba consta de dos partes: seis preguntas de opción múltiple, cuya
        evaluación y justificación aparecen de inmediato al seleccionar una
        respuesta, y ocho preguntas abiertas que se presentan una a la vez.
        Cada intento reordena aleatoriamente las preguntas y sus opciones.
      </p>
      <button className="btn btn-solid btn-large" onClick={onStart}>
        Comenzar examen
      </button>
    </section>
  );
}

function McSection({
  questions,
  answers,
  score,
  answeredCount,
  allAnswered,
  onSelect,
  onContinue,
}) {
  return (
    <section>
      <div className="section-label">Sección I &middot; Opción múltiple</div>

      <div className="score-banner">
        <span className="score-number">{score}</span>
        <span className="score-of">/ {questions.length}</span>
        <span className="score-caption">
          respuestas correctas &middot; {answeredCount} de {questions.length} respondidas
        </span>
      </div>

      <div className="mc-list">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          const answered = selected !== undefined;
          return (
            <div className="card mc-card" key={q.id}>
              <p className="mc-prompt">
                <span className="mc-num">{qi + 1}</span>
                {q.prompt}
              </p>
              <div className="mc-options">
                {q.options.map((opt, oi) => {
                  const letter = LETTERS[oi];
                  const isSelected = selected === oi;
                  const isCorrect = q.correctIndex === oi;
                  let stateClass = "";
                  if (answered) {
                    if (isCorrect) stateClass = "opt-correct";
                    else if (isSelected && !isCorrect) stateClass = "opt-incorrect";
                  }
                  return (
                    <button
                      key={oi}
                      className={`mc-option ${stateClass}`}
                      onClick={() => onSelect(q.id, oi)}
                      disabled={answered}
                    >
                      <span className="mc-letter">{letter}</span>
                      <span className="mc-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="justification">
                  <span className="justification-label">
                    {selected === q.correctIndex ? "Respuesta correcta" : "Justificación"}
                  </span>
                  <p>{q.justification}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="section-footer">
          <button className="btn btn-solid btn-large" onClick={onContinue}>
            Continuar a las preguntas abiertas
          </button>
        </div>
      )}
    </section>
  );
}

function OpenSection({
  question,
  index,
  total,
  value,
  revealed,
  onChange,
  onSubmit,
  onNext,
}) {
  const progressPct = ((index + 1) / total) * 100;
  const isLast = index + 1 === total;

  return (
    <section>
      <div className="section-label">Sección II &middot; Preguntas abiertas</div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="progress-text">
          Pregunta {index + 1} de {total}
        </span>
      </div>

      <div className="card open-card" key={question.id}>
        <span className="open-block-tag">{question.block}</span>
        <p className="open-prompt">{question.prompt}</p>

        <textarea
          className="open-textarea"
          placeholder="Escribe tu respuesta aquí..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={revealed}
          rows={6}
        />

        {!revealed ? (
          <button className="btn btn-solid" onClick={onSubmit}>
            Enviar respuesta
          </button>
        ) : (
          <>
            <div className="justification justification-open">
              <span className="justification-label">Justificación teórica</span>
              <p>{question.justification}</p>
            </div>
            <button className="btn btn-solid" onClick={onNext}>
              {isLast ? "Finalizar examen" : "Siguiente pregunta"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function DoneScreen({ mcScore, mcTotal, onReset }) {
  return (
    <section className="card done-card">
      <p className="done-copy">
        Completaste la sección de opción múltiple con{" "}
        <strong>
          {mcScore} de {mcTotal}
        </strong>{" "}
        respuestas correctas, y revisaste la justificación teórica de las ocho
        preguntas abiertas.
      </p>
      <button className="btn btn-solid btn-large" onClick={onReset}>
        Reiniciar examen
      </button>
    </section>
  );
}

/* ---------------------------------------------------------
   ESTILOS
--------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');

.exam-root {
  --bg: #FFF7F9;
  --surface: #FFEAF1;
  --surface-2: #FFF0F5;
  --accent: #D6336C;
  --accent-dark: #8A1F4B;
  --text: #2B1220;
  --text-soft: #7A4A5C;
  --border: #F2C6D6;
  --correct: #1F8A5C;
  --correct-bg: #E7F6EE;
  --incorrect: #C0324D;
  --incorrect-bg: #FDEBF0;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Work Sans', sans-serif;
  display: flex;
  flex-direction: column;
}

.exam-root *,
.exam-root *::before,
.exam-root *::after {
  box-sizing: border-box;
}

.exam-root button:focus-visible,
.exam-root textarea:focus-visible {
  outline: 2.5px solid var(--accent-dark);
  outline-offset: 2px;
}

.exam-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(180deg, #FFF7F9 80%, rgba(255,247,249,0));
  backdrop-filter: blur(2px);
  padding: 28px 32px 18px 32px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}

.exam-header-title {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.25;
  color: var(--accent-dark);
  max-width: 640px;
}

.reset-wrap {
  display: flex;
  align-items: center;
}

.reset-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-soft);
  background: var(--surface);
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.exam-main {
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 24px 80px 24px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 18px;
  letter-spacing: 0.2px;
}

.card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px 26px;
  box-shadow: 0 1px 2px rgba(138, 31, 75, 0.04);
}

.start-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
}

.start-copy {
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--text-soft);
  margin: 0;
}

.btn {
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 14.5px;
  border-radius: 12px;
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease, background 0.12s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.btn-solid {
  background: var(--accent);
  color: #ffffff;
}

.btn-solid:not(:disabled):hover {
  background: var(--accent-dark);
}

.btn-ghost {
  background: transparent;
  color: var(--accent-dark);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  background: var(--surface);
}

.btn-large {
  padding: 14px 26px;
  font-size: 15.5px;
}

.btn-tiny {
  padding: 6px 12px;
  font-size: 12.5px;
  border-radius: 8px;
}

.mc-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mc-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mc-prompt {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.55;
  font-weight: 500;
  display: flex;
  gap: 10px;
}

.mc-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--surface);
  color: var(--accent-dark);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mc-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mc-option {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  background: var(--surface-2);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  transition: border-color 0.12s ease, background 0.12s ease;
}

.mc-option:not(:disabled):hover {
  border-color: var(--accent);
}

.mc-letter {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  color: var(--accent-dark);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.opt-selected {
  border-color: var(--accent-dark);
  background: var(--surface);
}

.opt-correct {
  border-color: var(--correct);
  background: var(--correct-bg);
}

.opt-correct .mc-letter {
  border-color: var(--correct);
  color: var(--correct);
}

.opt-incorrect {
  border-color: var(--incorrect);
  background: var(--incorrect-bg);
}

.opt-incorrect .mc-letter {
  border-color: var(--incorrect);
  color: var(--incorrect);
}

.justification {
  margin-top: 4px;
  background: var(--surface);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  padding: 12px 14px;
}

.justification-label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-dark);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
}

.justification p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text);
}

.score-banner {
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 20px;
}

.score-number {
  font-family: 'Fraunces', serif;
  font-size: 34px;
  font-weight: 700;
  color: var(--accent-dark);
}

.score-of {
  font-size: 18px;
  color: var(--text-soft);
}

.score-caption {
  font-size: 13px;
  color: var(--text-soft);
  margin-left: 4px;
}

.section-footer {
  margin-top: 26px;
  display: flex;
  justify-content: center;
}

.progress-wrap {
  margin-bottom: 22px;
}

.progress-track {
  height: 6px;
  background: var(--surface);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 8px;
  font-size: 12.5px;
  color: var(--text-soft);
}

.open-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeSlide 0.28s ease;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.open-block-tag {
  align-self: flex-start;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-dark);
  background: var(--surface);
  padding: 4px 10px;
  border-radius: 999px;
}

.open-prompt {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
}

.open-textarea {
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.55;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  resize: vertical;
}

.open-textarea:disabled {
  opacity: 0.75;
}

.justification-open {
  border-left-color: var(--accent-dark);
}

.done-card {
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: flex-start;
}

.done-copy {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--text-soft);
}

.done-copy strong {
  color: var(--accent-dark);
}

@media (max-width: 560px) {
  .exam-header { padding: 22px 18px 14px 18px; }
  .exam-header-title { font-size: 21px; }
  .exam-main { padding: 26px 14px 60px 14px; }
  .card { padding: 20px 18px; }
}
`;
