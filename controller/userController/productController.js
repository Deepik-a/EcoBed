const userSchema=require('../../model/userSchema')
const productSchema=require('../../model/productSchema')
const categorySchema=require('../../model/categorySchema')




// Controller to get products by category
const getProductsByCategory = async (req, res) => {
  try {
   
      const categoryName = req.params.categoryName;
   

      // First, find the category by its name
      const category = await categorySchema.findOne({ name: categoryName });
      if (!category) {
          return res.status(404).send('Category not found');
      }
      
     
      // Then, find products that match the category's ObjectId
      const products = await productSchema.find({ category: category._id, isActive: true })
                                    .populate('category'); // populate to get category details if needed
     
    
      // Render the EJS file with the fetched products and category name
      res.render('user/categoryProducts', { products, categoryName });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
};



// Get Product Detail by ID
const getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id; // Get product ID from URL params
        const product = await productSchema.findById(productId).populate('category')// Fetch product and populate category

        if (!product) {
            return res.status(404).render('404', { message: 'Product not found' });
        }

        // Get the category name from the populated category object
        const categoryName = product.category.name;

        // Render the product detail page and pass product data + categoryName
        res.render('user/productsDetail', { product, categoryName });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server Error');
    }
};

const imageZoom= async (req, res) => {
    try {
        const product = await productSchema.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('user/zoom', { product }); // Rendering a new 'zoom.ejs' view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
// productController.js



// Controller to fetch all products
const getAllProducts = async (req, res) => {
    try {
        console.log("getAllProducts")
        const products = await productSchema.find({ isActive: true}); // Fetch all products from the database
        const categories = await categorySchema.find({ isDeleted: false });
        res.render('user/AllProduct', { products,categories }); 
    } catch (error) {
        console.log('Error fetching products: ', error);
        res.status(500).send('Error fetching products');
    }
};

const sortAllproducts= async (req, res) => {
    const categories = await categorySchema.find({ isDeleted: false });
    let sortOption = {};

    switch (req.query.sort) {
        // case 'popularity':
        //     sortOption = { popularity: -1 }; // Assuming you have a 'popularity' field in your products
        //     break;
        case 'price_low_high':
            sortOption = { price: 1 }; // Sort by price ascending
            break;
        case 'price_high_low':
            sortOption = { price: -1 }; // Sort by price descending
            break;
       // case 'ratings':
          //  sortOption = { averageRating: -1 }; // Sort by ratings descending
          //  break;
       // case 'featured':
           // sortOption = { featured: -1 }; // Assuming you have a 'featured' field
           // break;
        case 'new_arrivals':
            sortOption = { createdAt: -1 }; // Assuming 'createdAt' field stores product creation date
            break;
        case 'az':
            sortOption = { name: 1 }; // Sort alphabetically A-Z
            break;
        case 'za':
            sortOption = { name: -1 }; // Sort alphabetically Z-A
            break;
        default:
            sortOption = {}; // Default sort, no sorting
    }

    const products = await productSchema.find().sort(sortOption);
    res.render('user/AllProduct', { products,categories});
};


const searchbyProducts= async (req, res) => {
   
        const searchQuery = req.body.search;
    const categories = await categorySchema.find({ isDeleted: false });

    
        // Perform a database search for products
        const products = await productSchema.find({
            name: { $regex: searchQuery, $options: 'i' } // Case-insensitive search
        });
    
        // If no products found, show "no results" message
        const message = products.length === 0 ? 'Sorry, no results found! Please check the spelling or try searching for something else.' : '';
    
        // Render the all-products page with the search results
        res.render('user/Allproduct', {
            products: products,
            message: message,
            categories// Assuming you are fetching categories too
        });
    };
    






module.exports = {
    getProductsByCategory,
    getProductDetail,
    imageZoom,
    getAllProducts,
    sortAllproducts,
    searchbyProducts
};
