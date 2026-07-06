// ─── ACESSIBILIDADE ───────────────────────────────────────────────────────────

const acessibilidade = {
  fontSize: 0,
  altoContraste: false,
  daltonico: false,
  espacamento: false,
  sublinkhar: false,
};

function getAlvo() {
  return document.getElementById("conteudoPrincipal") || document.body;
}

// ── FONTE ──────────────────────────────────────────────────────────────────────
function aumentarFonte() {
  if (acessibilidade.fontSize < 4) {
    acessibilidade.fontSize++;
    const escala = 1 + acessibilidade.fontSize * 0.15;
    document.getElementById("conteudoPrincipal").style.zoom = escala;
    atualizarBadge("badgeFonte", acessibilidade.fontSize !== 0, `+${acessibilidade.fontSize * 15}%`);
  }
}

function diminuirFonte() {
  if (acessibilidade.fontSize > -2) {
    acessibilidade.fontSize--;
    const escala = 1 + acessibilidade.fontSize * 0.15;
    document.getElementById("conteudoPrincipal").style.zoom = escala;
    atualizarBadge("badgeFonte", acessibilidade.fontSize !== 0, acessibilidade.fontSize < 0 ? `${acessibilidade.fontSize * 15}%` : `+${acessibilidade.fontSize * 15}%`);
  }
  if (acessibilidade.fontSize === 0) atualizarBadge("badgeFonte", false, "");
}

function resetFonte() {
  acessibilidade.fontSize = 0;
  document.getElementById("conteudoPrincipal").style.zoom = 1;
  atualizarBadge("badgeFonte", false, "");
}

// ── ALTO CONTRASTE ─────────────────────────────────────────────────────────────
function toggleContraste() {
  acessibilidade.altoContraste = !acessibilidade.altoContraste;
  getAlvo().classList.toggle("alto-contraste", acessibilidade.altoContraste);
  atualizarBadge("badgeContraste", acessibilidade.altoContraste, "ON");
  atualizarBotaoAtivo("btnContraste", acessibilidade.altoContraste);
}

// ── DALTÔNICO ──────────────────────────────────────────────────────────────────
function toggleDaltonico() {
  acessibilidade.daltonico = !acessibilidade.daltonico;
  getAlvo().classList.toggle("daltonico", acessibilidade.daltonico);
  atualizarBadge("badgeDaltonico", acessibilidade.daltonico, "ON");
  atualizarBotaoAtivo("btnDaltonico", acessibilidade.daltonico);
}

// ── ESPAÇAMENTO ────────────────────────────────────────────────────────────────
function toggleEspacamento() {
  acessibilidade.espacamento = !acessibilidade.espacamento;
  getAlvo().classList.toggle("espacamento-letras", acessibilidade.espacamento);
  atualizarBadge("badgeEspacamento", acessibilidade.espacamento, "ON");
  atualizarBotaoAtivo("btnEspacamento", acessibilidade.espacamento);
}

// ── SUBLINHAR LINKS ────────────────────────────────────────────────────────────
function toggleSublinhar() {
  acessibilidade.sublinkhar = !acessibilidade.sublinkhar;
  getAlvo().classList.toggle("sublinhar-links", acessibilidade.sublinkhar);
  atualizarBadge("badgeSublinhar", acessibilidade.sublinkhar, "ON");
  atualizarBotaoAtivo("btnSublinhar", acessibilidade.sublinkhar);
}

// ── RESETAR TUDO ───────────────────────────────────────────────────────────────
function resetarTudo() {
  acessibilidade.fontSize = 0;
  acessibilidade.altoContraste = false;
  acessibilidade.daltonico = false;
  acessibilidade.espacamento = false;
  acessibilidade.sublinkhar = false;

  const alvo = document.getElementById("conteudoPrincipal");
  alvo.style.zoom = 1;
  alvo.style.filter = "";
  alvo.classList.remove("alto-contraste", "daltonico", "espacamento-letras", "sublinhar-links");

  ["badgeFonte", "badgeContraste", "badgeDaltonico", "badgeEspacamento", "badgeSublinhar"].forEach(id => {
    atualizarBadge(id, false, "");
  });

  ["btnContraste", "btnDaltonico", "btnEspacamento", "btnSublinhar"].forEach(id => {
    atualizarBotaoAtivo(id, false);
  });
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function atualizarBadge(id, ativo, texto) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = ativo ? "inline-block" : "none";
  el.textContent = texto;
}

function atualizarBotaoAtivo(id, ativo) {
  const el = document.getElementById(id);
  if (!el) return;
  if (ativo) el.classList.add("ativo");
  else el.classList.remove("ativo");
}

// ── TOGGLE PAINEL ──────────────────────────────────────────────────────────────
function togglePainelAcessibilidade() {
  const painel = document.getElementById("painelAcessibilidade");
  const aberto = painel.classList.toggle("aberto");
  document.getElementById("btnAcessibilidade").setAttribute("aria-expanded", aberto);
}

document.addEventListener("click", (e) => {
  const painel = document.getElementById("painelAcessibilidade");
  const btn = document.getElementById("btnAcessibilidade");
  if (!painel || !btn) return;
  if (!painel.contains(e.target) && !btn.contains(e.target)) {
    painel.classList.remove("aberto");
    btn.setAttribute("aria-expanded", false);
  }
});