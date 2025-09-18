const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Criar um objeto Express e configurar Porta
const app = express();
const port = 3000;

// Vincular o middleware ao Express
app.use(cors());

// Permissâo para usar outros métodos HTTP
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

//Permissâo servidor
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Conectar ao banco de dados
let url = "mongodb://localhost:27017/FatecVotorantim";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados", err);
  });

// Importar modelo Aluno
const Aluno = require('./models/Aluno');

// Rotas REST para Aluno

// Criar novo aluno
app.post('/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json(aluno);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar aluno', detalhes: err });
  }
});

// Listar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar alunos', detalhes: err });
  }
});

// Visualizar aluno específico
app.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno', detalhes: err });
  }
});

// Editar aluno
app.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar aluno', detalhes: err });
  }
});

// Excluir aluno
app.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json({ mensagem: 'Aluno excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir aluno', detalhes: err });
  }
});


// Rota padrão
app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
