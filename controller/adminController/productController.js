const productSchema = require('../../model/productSchema');
const upload = require('../../middleware/multer');
const categorySchema = require('../../model/categorySchema')
const fs = require('fs');


//--------------------------------------------- Get a Product ---------------------------
const getProduct = async (req, res) => {
    try {
        const categories = await categorySchema.find();
        const products= await productSchema.find({ isDeleted: false });
        res.render('admin/Product', { products, error: '',categories });
    } catch (error) {
        res.render('admin/Product', { error: 'Error fetching products', products: [] });
    }
};

//--------------------------------------------- Add a new product ---------------------------
const addProduct = async (req, res) => {
    try {
        const imgArray = [];

        req.files.forEach((img) => {
            imgArray.push(img.path); // Add image paths to the array
        });

        const { name, price, description, stock, category } = req.body; // category comes from form input

        // Find the category by its name
        const categoryName = await categorySchema.findOne({ name: category }); // Use 'name' field in categorySchema
        console.log("name",categoryName);

        if (!categoryName) {
            return res.status(400).send('Category not found');
        }

        const product = new productSchema({
            name,
            price,
            description,
            stock,
            category: categoryName,// Include category ObjectId in product schema
            imgArray
        });

        await product.save();

        // Redirect with success flag
        res.redirect('/admin/addProduct?success=true');
    } catch (error) {
        console.error('Error adding product:', error);
        res.redirect('/admin/addProduct?success=false');
    }
};




const editProduct = async (req, res) => {

    try {
        const { id } = req.params;
        console.log("id",id )
        
        const { name, stock, price, description, category, isActive } = req.body;

        console.log("Request body:", req.body);

        // Find the category by its name
        const categoryName = await categorySchema.find({});

        if (!categoryName) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Find product by ID and update it
        const updatedProduct = await productSchema.findByIdAndUpdate(
            id,
            {
                name,
                stock,
                price,
                category: categoryName._id,
                description,
                isActive
            },
            { new: true }
        );
        console.log("updatedProduct",updatedProduct )

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Redirect to product list page with success flag
        res.redirect('/admin/editProduct?success=true');
        console.log("product updated successfully");
        console.log("updatedProduct",updatedProduct )

    } catch (error) {
        console.error('Error updating product:', error);
        res.redirect('/admin/editProduct?error=true');
    }
};



//--------------------------------------------- Get Edit Product Page ---------------------------
const geteditProduct = async (req, res) => {
    try {
        // Fetch all products and populate the category field
        const product = await productSchema.find({}).populate('category', 'name'); // Populate 'category' with only 'name'
        
        // Fetch all categories
        const categories = await categorySchema.find({}, 'name'); // Fetch only the 'name' field from categories

        // Render the Productlist page with both products and categories
        res.render('admin/Productlist', { product, categories, success: req.query.success, error: req.query.error });
    } catch (error) {
        console.error('Error rendering edit product page:', error);
        res.status(500).send('Internal Server Error');
    }
};








module.exports={
    getProduct,
    addProduct,
    geteditProduct,
    editProduct,
}