const categoriaService = require('../services/categoriaService');

const createCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.createCategoria(req.body);
    res.status(201).json({ status: 'success', data: categoria });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoriaService.getCategories();
    res.json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const categoria = await categoriaService.getCategoriaById(req.params.id);
    if (!categoria) return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    res.json({ status: 'success', data: categoria });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.updateCategoria(req.params.id, req.body);
    if (!categoria) return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    res.json({ status: 'success', data: categoria });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.deleteCategoria(req.params.id);
    if (!categoria) return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    res.json({ status: 'success', message: 'Categoria eliminada correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createCategoria,
  getCategories,
  getCategoriaById,
  updateCategoria,
  deleteCategoria
};
