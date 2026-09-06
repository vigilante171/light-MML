import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await Category.create({
      name,
      description,
      slug,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();

  res.json({
    success: true,
    data: categories,
  });
};

// ✅ New functions

export const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name !== undefined) {
      category.name = name.trim();
      category.slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productsUsingCategory = await Product.countDocuments({
      category: category._id,
    });

    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because products use it",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
