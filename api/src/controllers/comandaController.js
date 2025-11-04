const comandaService = require('../services/comandaService');

const createComanda = async (req, res) => {
  try {
    const comanda = await comandaService.createComanda(req.body);
    res.status(201).json({ status: 'success', data: comanda });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getComandes = async (req, res) => {
  try {
    const comandes = await comandaService.getComandes();
    res.json({ status: 'success', data: comandes });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getComandaById = async (req, res) => {
  try {
    const comanda = await comandaService.getComandaById(req.params.id);
    if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
    res.json({ status: 'success', data: comanda });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateComanda = async (req, res) => {
  try {
    const comanda = await comandaService.updateComanda(req.params.id, req.body);
    if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
    res.json({ status: 'success', data: comanda });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteComanda = async (req, res) => {
  try {
    const comanda = await comandaService.deleteComanda(req.params.id);
    if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
    res.json({ status: 'success', message: 'Comanda eliminada correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createComanda,
  getComandes,
  getComandaById,
  updateComanda,
  deleteComanda
};
