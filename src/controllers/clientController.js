const clientService = require('../services/clientService');

const createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json({ status: 'success', data: client });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients();
    res.json({ status: 'success', data: clients });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) return res.status(404).json({ status: 'error', message: 'Client no trobat' });
    res.json({ status: 'success', data: client });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    if (!client) return res.status(404).json({ status: 'error', message: 'Client no trobat' });
    res.json({ status: 'success', data: client });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await clientService.deleteClient(req.params.id);
    if (!client) return res.status(404).json({ status: 'error', message: 'Client no trobat' });
    res.json({ status: 'success', message: 'Client eliminat correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};
