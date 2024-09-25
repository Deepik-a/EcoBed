const Category = require('../../model/categorySchema');
const Product = require('../../model/productSchema');

// Controller function to get products grouped by category




const getAllProductsGroupedByCategory = async (req, res) => {
  try {
    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).lean();

    // For each category, fetch the active products that belong to the category
    for (let category of categories) {
      category.products = await Product.find({ category: category._id, isActive: true }).lean();
    }

    // Render the EJS view with categories and products
    res.render('user/productList', { categories });
  } catch (error) {
    console.error('Error fetching categories or products:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { 
    getAllProductsGroupedByCategory 
};

