const detallComandaService = require('../services/detallComandaService');

const createDetallComanda = async (req, res) => {
  try {
    const detall = await detallComandaService.createDetallComanda(req.body);
    res.status(201).json({ status: 'success', data: detall });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getDetallsComanda = async (req, res) => {
  try {
    const detalls = await detallComandaService.getDetallsComanda();
    res.json({ status: 'success', data: detalls });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getDetallComandaById = async (req, res) => {
  try {
    const detall = await detallComandaService.getDetallComandaById(req.params.id);
    if (!detall) return res.status(404).json({ status: 'error', message: 'Detall de comanda no trobat' });
    res.json({ status: 'success', data: detall });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateDetallComanda = async (req, res) => {
  try {
    const detall = await detallComandaService.updateDetallComanda(req.params.id, req.body);
    if (!detall) return res.status(404).json({ status: 'error', message: 'Detall de comanda no trobat' });
    res.json({ status: 'success', data: detall });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteDetallComanda = async (req, res) => {
  try {
    const detall = await detallComandaService.deleteDetallComanda(req.params.id);
    if (!detall) return res.status(404).json({ status: 'error', message: 'Detall de comanda no trobat' });
    res.json({ status: 'success', message: 'Detall de comanda eliminat correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createDetallComanda,
  getDetallsComanda,
  getDetallComandaById,
  updateDetallComanda,
  deleteDetallComanda
};
