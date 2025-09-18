const mongoose = require('mongoose');

const EnderecoSchema = new mongoose.Schema({
  cep: { type: String, required: true },
  logradouro: { type: String, required: true },
  cidade: { type: String, required: true },
  bairro: { type: String, required: true },
  estado: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String }
});

const AlunoSchema = new mongoose.Schema({
  matricula: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  endereco: { type: EnderecoSchema, required: true },
  cursos: { type: [String], default: [] },
  observacoes: { type: String }
});

module.exports = mongoose.model('Aluno', AlunoSchema);