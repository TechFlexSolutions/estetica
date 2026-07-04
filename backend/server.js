const API_URL = "https://estetica-g9mn.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("agendamentoForm");
  const horarios   = document.querySelectorAll(".horario");
  const dataInput  = document.getElementById("dataAgendamento");
  const btnSubmit  = document.getElementById("btnSubmit");

  // Data mínima = hoje
  dataInput.min = new Date().toISOString().split("T")[0];

  let horarioSelecionado = "";

  // ── TOAST ────────────────────────────────────────────────────────────────
  function showToast(msg, type = "success") {
    const toast     = document.getElementById("toast");
    const toastMsg  = document.getElementById("toastMsg");
    const toastIcon = document.getElementById("toastIcon");
    toast.className = `toast ${type} show`;
    toastIcon.textContent = type === "success" ? "✅" : "❌";
    toastMsg.textContent  = msg;
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  // ── INDICADOR DE STEPS ───────────────────────────────────────────────────
  function updateSteps() {
    const nome        = document.getElementById("nome").value;
    const telefone    = document.getElementById("telefone").value;
    const tipoVeiculo = document.getElementById("tipoVeiculo").value;
    const nomeVeiculo = document.getElementById("nomeVeiculo").value;
    const lavagem     = document.getElementById("lavagem").value;
    const data        = dataInput.value;

    const s1 = document.getElementById("step1");
    const s2 = document.getElementById("step2");
    const s3 = document.getElementById("step3");

    if (nome && telefone) {
      s1.className = "step done";
      s2.className = "step active";
    } else {
      s1.className = "step active";
      s2.className = "step";
    }

    if (tipoVeiculo && nomeVeiculo && lavagem) {
      s2.className = "step done";
      s3.className = "step active";
    }

    if (data && horarioSelecionado) {
      s3.className = "step done";
    }
  }

  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", updateSteps);
    el.addEventListener("change", updateSteps);
  });

  // ── HORÁRIOS OCUPADOS ────────────────────────────────────────────────────
  async function atualizarHorarios(data) {
    if (!data) return;
    try {
      const resp    = await fetch(`${API_URL}/horarios-ocupados?data=${data}`);
      const ocupados = await resp.json();

      horarios.forEach((btn) => {
        const horario = btn.innerText.trim();
        if (ocupados.includes(horario)) {
          btn.classList.add("ocupado");
          btn.classList.remove("selecionado");
          btn.disabled = true;
        } else {
          btn.classList.remove("ocupado");
          btn.disabled = false;
        }
      });

      if (ocupados.includes(horarioSelecionado)) {
        horarioSelecionado = "";
      }
    } catch (erro) {
      console.error("Erro ao buscar horários:", erro);
    }
  }

  dataInput.addEventListener("change", () => {
    horarioSelecionado = "";
    horarios.forEach((btn) => btn.classList.remove("selecionado"));
    atualizarHorarios(dataInput.value);
    updateSteps();
  });

  // ── SELECIONAR HORÁRIO ───────────────────────────────────────────────────
  horarios.forEach((horario) => {
    horario.addEventListener("click", () => {
      if (horario.disabled) return;
      horarios.forEach((btn) => btn.classList.remove("selecionado"));
      horario.classList.add("selecionado");
      horarioSelecionado = horario.innerText.trim();
      updateSteps();
    });
  });

  // ── MÁSCARA TELEFONE ─────────────────────────────────────────────────────
  document.getElementById("telefone").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    this.value = v;
  });

  // ── BOTÃO WHATSAPP ───────────────────────────────────────────────────────
  document.getElementById("whatsappBtn").addEventListener("click", () => {
    const nome        = document.getElementById("nome").value;
    const telefone    = document.getElementById("telefone").value;
    const tipoVeiculo = document.getElementById("tipoVeiculo").value;
    const nomeVeiculo = document.getElementById("nomeVeiculo").value;
    const lavagem     = document.getElementById("lavagem").value;
    const data        = dataInput.value;

    const msg = `Olá! Gostaria de agendar:%0A%0A👤 *${nome || "—"}*%0A📞 ${telefone || "—"}%0A🚗 ${tipoVeiculo || "—"} — ${nomeVeiculo || "—"}%0A🧼 ${lavagem || "—"}%0A📅 ${data || "—"} às ${horarioSelecionado || "—"}`;
    window.open(`https://wa.me/5531999999999?text=${msg}`, "_blank");
  });

  // ── ENVIAR FORMULÁRIO ────────────────────────────────────────────────────
  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!horarioSelecionado) {
      showToast("Selecione um horário disponível.", "error");
      return;
    }

    const nome        = document.getElementById("nome").value;
    const telefone    = document.getElementById("telefone").value;
    const tipoVeiculo = document.getElementById("tipoVeiculo").value;
    const nomeVeiculo = document.getElementById("nomeVeiculo").value;
    const lavagem     = document.getElementById("lavagem").value;
    const data        = dataInput.value;

    btnSubmit.textContent = "Aguarde...";
    btnSubmit.classList.add("loading");

    try {
      const resposta = await fetch(`${API_URL}/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, tipoVeiculo, nomeVeiculo, lavagem, data, horario: horarioSelecionado }),
      });

      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.erro || "Erro desconhecido");

      showToast("Agendamento confirmado com sucesso!");
      formulario.reset();
      horarioSelecionado = "";
      horarios.forEach((btn) => {
        btn.classList.remove("selecionado", "ocupado");
        btn.disabled = false;
      });
      updateSteps();

    } catch (erro) {
      showToast("Erro ao realizar agendamento. Tente novamente.", "error");
      console.error(erro);
    } finally {
      btnSubmit.textContent = "Confirmar Agendamento";
      btnSubmit.classList.remove("loading");
    }
  });

});