import Product from "../models/Product.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Products
export const getProducts = async (req, res) => {
  const products = await Product.find().populate("category");

  res.json({
    success: true,
    data: products,
  });
};

// ✅ Get Product By ID
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    data: product,
  });
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      slug,
      description,
      price,
      stock,
      category,
      images,
      isActive,
      isCommissionable,
      commissionValue,
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (slug !== undefined) product.slug = slug.trim().toLowerCase();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (images !== undefined) product.images = images;
    if (isActive !== undefined) product.isActive = isActive;
    if (isCommissionable !== undefined) product.isCommissionable = isCommissionable;
    if (commissionValue !== undefined) product.commissionValue = commissionValue;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate("category");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
