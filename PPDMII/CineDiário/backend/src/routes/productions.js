const express = require('express');
const router = express.Router();
const Production = require('../models/Production');

// CREATE - Adicionar nova produção
router.post('/', async (req, res) => {
  try {
    const production = new Production(req.body);
    const savedProduction = await production.save();
    res.status(201).json(savedProduction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Obter todas as produções
router.get('/', async (req, res) => {
  try {
    const productions = await Production.find().sort({ dateCriacao: -1 });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Obter produção por ID
router.get('/:id', async (req, res) => {
  try {
    const production = await Production.findOne({ id: req.params.id });
    if (!production) {
      return res.status(404).json({ error: 'Produção não encontrada' });
    }
    res.json(production);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Obter produções por tipo
router.get('/type/:type', async (req, res) => {
  try {
    const productions = await Production.find({ tipo: req.params.type }).sort({
      dateCriacao: -1,
    });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Obter produções por gênero
router.get('/genre/:genre', async (req, res) => {
  try {
    const productions = await Production.find({ genero: req.params.genre }).sort({
      dateCriacao: -1,
    });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Obter produções por plataforma
router.get('/platform/:platform', async (req, res) => {
  try {
    const productions = await Production.find({ ondeAssistiu: req.params.platform }).sort({
      dateCriacao: -1,
    });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Atualizar produção
router.put('/:id', async (req, res) => {
  try {
    const production = await Production.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!production) {
      return res.status(404).json({ error: 'Produção não encontrada' });
    }
    res.json(production);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Deletar produção
router.delete('/:id', async (req, res) => {
  try {
    const production = await Production.findOneAndDelete({ id: req.params.id });
    if (!production) {
      return res.status(404).json({ error: 'Produção não encontrada' });
    }
    res.json({ message: 'Produção deletada com sucesso', production });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
