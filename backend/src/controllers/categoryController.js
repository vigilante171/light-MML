import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        const slug = name
            .toLowerCase()
            .replace(/\s+/g, "-");

        const category = await Category.create({
            name,
            description,
            slug
        });

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

export const getCategories = async (req, res) => {

    const categories = await Category.find();

    res.json({
        success: true,
        data: categories
    });

};