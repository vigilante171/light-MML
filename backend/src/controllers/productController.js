import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

export const getProducts = async (req, res) => {

    const products = await Product.find()
        .populate("category");

    res.json({
        success: true,
        data: products
    });

};

export const getProductById = async (req, res) => {

    const product = await Product.findById(req.params.id)
        .populate("category");

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        data: product
    });

};