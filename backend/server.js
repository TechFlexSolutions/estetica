const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONFIGURAÇÃO SUPABASE ────────────────────────────────────────────────────
const SUPABASE_URL = "https://cueyxhvsbovesfoeeetl.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_1bNkXwZZ3172CRv60urGxQ_4dxXUCvW";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

// ─── ROTA: SALVAR AGENDAMENTO ─────────────────────────────────────────────────
app.post("/api/agendamentos", async (req, res) => {
  const { nome, telefone, tipoVeiculo, nomeVeiculo, lavagem, data, horario } = req.body;

  if (!nome || !telefone || !data || !horario) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/agendamentos`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({
        nome,
        telefone,
        tipo_veiculo: tipoVeiculo,
        nome_veiculo: nomeVeiculo,
        lavagem,
        data_agendamento: data,
        horario,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro Supabase:", result);
      return res.status(500).json({ erro: "Erro ao salvar agendamento." });
    }

    console.log("Agendamento salvo. ID:", result[0].id);
    res.status(201).json({ mensagem: "Agendamento realizado com sucesso!", id: result[0].id });

  } catch (erro) {
    console.error("Erro:", erro);
    res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
  }
});

// ─── ROTA: HORÁRIOS OCUPADOS POR DATA ─────────────────────────────────────────
app.get("/api/horarios-ocupados", async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: "Data não informada." });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/agendamentos?select=horario&data_agendamento=eq.${data}`,
      { headers }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ erro: "Erro ao buscar horários." });
    }

    const horariosOcupados = result.map((r) => r.horario.trim());
    res.json(horariosOcupados);

  } catch (erro) {
    console.error("Erro:", erro);
    res.status(500).json({ erro: "Erro ao buscar horários." });
  }
});

// ─── ROTA: LISTAR AGENDAMENTOS ────────────────────────────────────────────────
app.get("/api/agendamentos", async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/agendamentos?order=data_agendamento.desc,horario.asc`,
      { headers }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ erro: "Erro ao buscar agendamentos." });
    }

    res.json(result);

  } catch (erro) {
    console.error("Erro:", erro);
    res.status(500).json({ erro: "Erro ao buscar agendamentos." });
  }
});

// ─── INICIAR SERVIDOR ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});