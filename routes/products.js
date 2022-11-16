const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//Get all products
router.get('/',  async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

//Get the product by id
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.status(200).json(product);
    } catch(err) {
        res.status(400).json({message: err});
    }
});

//Create a new product
router.post('/', async (req, res) => {
            const product = new Product({
                title: req.body.title,
                image: req.body.image,
                thumbnail: req.body.thumbnail,
                price: req.body.price,
                form: req.body.form,
                size: req.body.size,
                material: req.body.material
            });

            try {
                const saveProduct = await product.save();
                res.status(200).json(saveProduct);
            } catch(err) {
                res.status(400).json({message: err});
            }
});

//DELETE PRODUCT
router.delete('/:productId', async (req, res) => {
    try {
        const removeProduct = await Product.remove({_id: req.params.productId});
        res.status(200).json(removeProduct);
    } catch(err) {
        res.status(400).json({message: err});
    }
});

//UPDATE ITEMS
router.patch('/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.updateOne(
            {_id: req.params.productId}, 
            {$set: {title: req.body.title}
        });
        res.status(200).json(updatedProduct);
    } catch(err) {
        res.status(400).json({message: err});
    }
});

module.exports = router;