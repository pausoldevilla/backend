const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => res.json({ message: "Accés permès només a administradors" }));

router.post('/', authMiddleware, roleMiddleware('admin'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Rutes de productes
 */

/**
 * @swagger
 * /api/products/admin:
 *   get:
 *     summary: Ruta d'administració per a productes
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accès permès
 *       403:
 *         description: Accès denegat
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producte creat
 *   get:
 *     summary: Obtenir tots els productes
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Llista de productes
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtenir un producte per ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalls del producte
 *       404:
 *         description: Producte no trobat
 *   put:
 *     summary: Actualitzar un producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producte actualitzat
 *   delete:
 *     summary: Eliminar un producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producte eliminat
 */

module.exports = router;
