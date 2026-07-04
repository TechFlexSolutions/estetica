// ─── CALENDÁRIO CUSTOMIZADO ───────────────────────────────────────────────────

const FERIADOS_NACIONAIS = [
  "01-01", // Ano Novo
  "04-21", // Tiradentes
  "05-01", // Dia do Trabalho
  "09-07", // Independência
  "06-04", // Corpus Christi
  "10-12", // Nossa Senhora Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "11-20", // Consciência Negra
  "12-25", // Natal
];

// Feriados móveis — atualize todo ano
const FERIADOS_MOVEIS = {
  2025: ["2025-03-03", "2025-03-04", "2025-04-18", "2025-04-20"],
  2026: ["2026-02-16", "2026-02-17", "2026-04-03", "2026-04-05"],
  2027: ["2027-02-08", "2027-02-09", "2027-03-26", "2027-03-28"],
};

function isFeriado(date) {
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  const ano = date.getFullYear();
  const dataStr = `${ano}-${mes}-${dia}`;
  const fixo = `${mes}-${dia}`;

  if (FERIADOS_NACIONAIS.includes(fixo)) return true;
  if (FERIADOS_MOVEIS[ano] && FERIADOS_MOVEIS[ano].includes(dataStr)) return true;
  return false;
}

function isDomingo(date) {
  return date.getDay() === 0;
}

function isBloqueado(date) {
  return isDomingo(date) || isFeriado(date);
}

function isPassado(date) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return date < hoje;
}

// ─── RENDERIZAR CALENDÁRIO ────────────────────────────────────────────────────
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

let currentMonth, currentYear, dataSelecionada = null;

function initCalendario() {
  const hoje = new Date();
  currentMonth = hoje.getMonth();
  currentYear = hoje.getFullYear();
  renderCalendario();
}

function renderCalendario() {
  const container = document.getElementById("calendarioGrid");
  const titulo = document.getElementById("calendarioTitulo");
  if (!container || !titulo) return;

  titulo.textContent = `${MESES[currentMonth]} ${currentYear}`;
  container.innerHTML = "";

  // Cabeçalho dias da semana
  DIAS_SEMANA.forEach((dia) => {
    const el = document.createElement("div");
    el.className = "cal-header-day";
    el.textContent = dia;
    container.appendChild(el);
  });

  // Primeiro dia do mês
  const primeiroDia = new Date(currentYear, currentMonth, 1).getDay();

  // Dias vazios antes
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.className = "cal-day vazio";
    container.appendChild(vazio);
  }

  // Dias do mês
  const totalDias = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let d = 1; d <= totalDias; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const el = document.createElement("div");
    el.className = "cal-day";
    el.textContent = d;

    if (isPassado(date)) {
      el.classList.add("passado");
    } else if (isBloqueado(date)) {
      el.classList.add("bloqueado");
      el.title = isDomingo(date) ? "Não atendemos aos domingos" : "Feriado";
    } else {
      el.classList.add("disponivel");
      el.addEventListener("click", () => selecionarData(date, el));
    }

    // Marcar selecionado
    if (
      dataSelecionada &&
      date.toDateString() === dataSelecionada.toDateString()
    ) {
      el.classList.add("selecionado");
    }

    container.appendChild(el);
  }
}

function selecionarData(date, el) {
  // Remove seleção anterior
  document.querySelectorAll(".cal-day.selecionado").forEach((d) =>
    d.classList.remove("selecionado")
  );

  dataSelecionada = date;
  el.classList.add("selecionado");

  // Formatar para YYYY-MM-DD para o input hidden
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  const dataFormatada = `${ano}-${mes}-${dia}`;

  // Atualizar input hidden
  document.getElementById("dataAgendamento").value = dataFormatada;

  // Mostrar data selecionada formatada
  const dataDia = String(date.getDate()).padStart(2, "0");
  const dataMes = MESES[date.getMonth()];
  const dataAno = date.getFullYear();
  const diaSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][date.getDay()];

  document.getElementById("dataDisplay").textContent = `${diaSemana}, ${dataDia} de ${dataMes} de ${dataAno}`;
  document.getElementById("dataDisplay").classList.add("ativa");

  // Disparar evento change para atualizar horários
  document.getElementById("dataAgendamento").dispatchEvent(new Event("change"));
}

function mesAnterior() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendario();
}

function proximoMes() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendario();
}

document.addEventListener("DOMContentLoaded", () => {
  initCalendario();

  document.getElementById("btnMesAnterior").addEventListener("click", mesAnterior);
  document.getElementById("btnProximoMes").addEventListener("click", proximoMes);
});