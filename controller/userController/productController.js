
const productSchema=require('../../model/productSchema')




// Controller function to fetch all active products
const getAllProducts = async (req, res) => {
  try {
    // Fetch only products that are active (listed by the admin)
    const products = await productSchema.find({ isActive: true });
    
    // Render the products in the EJS view
    res.render('user/productList', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
};

module.exports = { 
  getAllProducts
 };
