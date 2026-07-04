const API_URL = "https://estetica-g9mn.onrender.com/api";
    const SENHA_ADMIN = "adm01dev";

    let todosAgendamentos = [];

    // ── LOGIN ──────────────────────────────────────────────────────────────────
    function fazerLogin() {
      const senha = document.getElementById("senhaInput").value;
      if (senha === SENHA_ADMIN) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("painel").style.display = "block";
        carregarAgendamentos();
      } else {
        document.getElementById("loginErro").style.display = "block";
      }
    }

    document.getElementById("senhaInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") fazerLogin();
    });

    function sair() {
      document.getElementById("loginScreen").style.display = "flex";
      document.getElementById("painel").style.display = "none";
      document.getElementById("senhaInput").value = "";
    }

    // ── CARREGAR AGENDAMENTOS ──────────────────────────────────────────────────
    async function carregarAgendamentos() {
      document.getElementById("tabelaConteudo").innerHTML = '<div class="loading">Carregando...</div>';

      try {
        const resp = await fetch(`${API_URL}/agendamentos`);
        todosAgendamentos = await resp.json();
        atualizarStats(todosAgendamentos);
        renderTabela(todosAgendamentos);
      } catch (erro) {
        document.getElementById("tabelaConteudo").innerHTML = '<div class="empty-state"><span>⚠️</span>Erro ao carregar agendamentos.</div>';
        console.error(erro);
      }
    }

    // ── STATS ──────────────────────────────────────────────────────────────────
    function atualizarStats(dados) {
      const hoje = new Date().toISOString().split("T")[0];
      const semana = new Date();
      semana.setDate(semana.getDate() - 7);
      const mes = new Date();
      mes.setDate(1);

      document.getElementById("statTotal").textContent = dados.length;
      document.getElementById("statHoje").textContent = dados.filter(a => a.data_agendamento === hoje).length;
      document.getElementById("statSemana").textContent = dados.filter(a => new Date(a.data_agendamento) >= semana).length;
      document.getElementById("statMes").textContent = dados.filter(a => new Date(a.data_agendamento) >= mes).length;
    }

    // ── FILTROS ────────────────────────────────────────────────────────────────
    function filtrar() {
      const nome = document.getElementById("filtroNome").value.toLowerCase();
      const data = document.getElementById("filtroData").value;

      let filtrados = todosAgendamentos;

      if (nome) filtrados = filtrados.filter(a => a.nome.toLowerCase().includes(nome));
      if (data) filtrados = filtrados.filter(a => a.data_agendamento === data);

      renderTabela(filtrados);
    }

    function limparFiltros() {
      document.getElementById("filtroNome").value = "";
      document.getElementById("filtroData").value = "";
      renderTabela(todosAgendamentos);
    }

    // ── RENDER TABELA ──────────────────────────────────────────────────────────
    function renderTabela(dados) {
      document.getElementById("tabelaCount").textContent = `${dados.length} registro(s)`;

      if (dados.length === 0) {
        document.getElementById("tabelaConteudo").innerHTML = `
          <div class="empty-state">
            <span>📅</span>
            Nenhum agendamento encontrado.
          </div>`;
        return;
      }

      const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

      const linhas = dados.map(a => {
        const [ano, mes, dia] = a.data_agendamento.split("-");
        const dataFormatada = `${dia} ${MESES[parseInt(mes)-1]} ${ano}`;
        const lavagem = a.lavagem ? a.lavagem.split("—")[0].trim() : "—";

        return `
          <tr>
            <td class="td-nome">${a.nome}</td>
            <td>${a.telefone}</td>
            <td><span class="badge-veiculo">${a.tipo_veiculo || "—"}</span> ${a.nome_veiculo || ""}</td>
            <td class="td-lavagem">${lavagem}</td>
            <td class="td-data">${dataFormatada}</td>
            <td class="td-horario">${a.horario}</td>
          </tr>`;
      }).join("");

      document.getElementById("tabelaConteudo").innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Veículo</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
        </table>`;
    }