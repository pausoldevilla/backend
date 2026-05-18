const productService = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    // 📸 SCREENSHOT: Logs manuals en controladors (Getting product list)
    if (req.log) {
      req.log.info({
        requestId: req.requestId
      }, 'Getting product list');
    }
    const products = await productService.getProducts();
    res.json({ status: 'success', data: products });
  } catch (error) {
    // 📸 SCREENSHOT: Logs manuals en errors (productController)
    if (req.log) {
      req.log.error({
        requestId: req.requestId,
        error: error.message
      }, 'Error getting products');
    }
    next(error); // Passem l'error al errorHandler global
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    res.json({ status: 'success', message: 'Producte eliminat correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
