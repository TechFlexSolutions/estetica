const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONFIGURAÇÃO DO BANCO ───────────────────────────────────────────────────
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456GV",
  database: "agendamentos_db",
};

// ─── ROTA: SALVAR AGENDAMENTO ────────────────────────────────────────────────
app.post("/api/agendamentos", async (req, res) => {
  const { nome, telefone, tipoVeiculo, nomeVeiculo, lavagem, data, horario } = req.body;

  if (!nome || !telefone || !data || !horario) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    const [result] = await conn.execute(
      `INSERT INTO agendamentos 
        (nome, telefone, tipo_veiculo, nome_veiculo, lavagem, data_agendamento, horario, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [nome, telefone, tipoVeiculo, nomeVeiculo, lavagem, data, horario]
    );

    await conn.end();

    console.log("Agendamento salvo. ID:", result.insertId);
    res.status(201).json({ mensagem: "Agendamento realizado com sucesso!", id: result.insertId });

  } catch (erro) {
    console.error("Erro MySQL:", erro);
    res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
  }
});

// ─── ROTA: HORÁRIOS OCUPADOS POR DATA ────────────────────────────────────────
app.get("/api/horarios-ocupados", async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: "Data não informada." });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      "SELECT horario FROM agendamentos WHERE data_agendamento = ?",
      [data]
    );
    await conn.end();

    const horariosOcupados = rows.map((r) => r.horario.trim());
    res.json(horariosOcupados);
  } catch (erro) {
    console.error("Erro MySQL:", erro);
    res.status(500).json({ erro: "Erro ao buscar horários." });
  }
});

// ─── ROTA: LISTAR AGENDAMENTOS ───────────────────────────────────────────────
app.get("/api/agendamentos", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      "SELECT * FROM agendamentos ORDER BY data_agendamento DESC, horario ASC"
    );
    await conn.end();
    res.json(rows);
  } catch (erro) {
    console.error("Erro MySQL:", erro);
    res.status(500).json({ erro: "Erro ao buscar agendamentos." });
  }
});

// ─── INICIAR SERVIDOR ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});