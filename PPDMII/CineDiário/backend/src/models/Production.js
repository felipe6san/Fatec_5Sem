const mongoose = require('mongoose');

const ProductionSchema = new mongoose.Schema({
  // Aceita o id string que vem do app (não usa o _id automático do Mongo)
  id: {
    type: String,
    required: true,
    unique: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  anoLancamento: {
    type: Number,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['filme', 'série'],
    required: true,
  },
  minhaNotas: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  ondeAssistiu: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    default: null,
  },
  resumo: {
    type: String,
    default: null,
  },
  dateCriacao: {
    type: Date,
    default: Date.now,
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now,
  },
});

ProductionSchema.pre('findByIdAndUpdate', function (next) {
  this.set({ dataAtualizacao: Date.now() });
  next();
});

module.exports = mongoose.model('Production', ProductionSchema);
