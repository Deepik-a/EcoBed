const Cart = require('../../model/cartSchema');
const Product = require('../../model/productSchema');
const User = require('../../model/userSchema');


const mongoose = require('mongoose'); // Ensure mongoose is required

const addToCart = async (req, res) => {
      
    const userId = req.session.user;
    if (!userId) {
        req.flash('error', "User is not logged in, please login again");
        return res.redirect('/login');
    }

    const productId = req.params.id; 
  
    try {
        // Ensure productId is treated as ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);
    
        const product = await Product.findById(productObjectId);
      
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect(`/product/${productId}`);
        }    
        
        
         // Check if the product has stock
         if (product.stock <= 0) {
            req.flash('error', 'Product is out of stock');
            return res.redirect(`/product/${productId}`);
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId }).populate('items.productId');
      
        if (!cart) {
            cart = new Cart({ userId, items: [], payableAmount: 0, totalPrice: 0 });
        }

        // Extract the first image from the imgArray, or use a default image if not available
        const productImage = product.imgArray && product.imgArray.length > 0 
            ? product.imgArray[0] 
            : '/uploads/1727417001149-147698323-bedroom-with-green-wall-bed-with-white-blanket-green-plant-middle.jpg'; // Default image path
          
          
          
        // Find if the product is already in the cart
        // let cartItem = cart.items.find(item => item.productId.toString() === productObjectId.toString());
let cartItem = cart.items.find(item => item.productId.equals(productObjectId));
     
  
if (cartItem) {
    // Check if adding the product exceeds the available stock
    if (cartItem.productCount + 1 > product.stock) {
        req.flash('error', 'Cannot add more than available stock');
    } else {
        cartItem.productCount += 1;
        if (!cartItem.productImage) {
            cartItem.productImage = productImage;
        }
    }
} else {
    // If adding new item, ensure we don't add more than the available stock
    cart.items.push({
        productId: product._id,
        productCount: 1,  // Default quantity is 1
        productPrice: product.price,
        productImage: productImage
    });
}

        // Recalculate total price and payable amount
        cart.totalPrice = cart.items.reduce((total, item) => total + item.productCount * item.productPrice, 0);
        cart.payableAmount = cart.totalPrice;

        // Save the updated cart
        await cart.save();

        res.render('user/cart', { cart, productId  });
    } catch (error) {
        console.error('Error adding to cart:', error.message);
    }
};



// Get cart
const getCart = async (req, res) => {
   
    const userId = req.session.user;
    if (!userId) {
        return res.render('user/login', { alertMessage: 'User not logged in' });
    }
  
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
    
        if (!cart || cart.length === 0) {
            req.flash('info', 'Your cart is empty');
            return res.render('user/cart', { cart: [] });
        }

        res.render('user/cart', { cart });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        req.flash('error', 'Error fetching cart');
        res.status(500).send('Server error');
    }
};




// Remove product from cart
const removeFromCart = async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.user; // Assuming user session contains userId

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.redirect('/cart');
        }

        // Filter out the product to remove it from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
       
        // Update total price and payable amount
        cart.totalPrice = cart.items.reduce((total, item) => total + item.productCount * item.productPrice, 0);
        cart.payableAmount = cart.totalPrice;
        await cart.save(); // Save the updated cart
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send('Server error');
    }
};

const updateCartQuantity = async (req, res) => {
    const productId = req.params.id;
    const newQuantity = parseInt(req.body.productCount);
    const userId = req.session.user;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.redirect('/cart');
        }

        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).send('Product not found in cart');
        }

        // Fetch product details to check the stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the new quantity exceeds available stock
        if (newQuantity > product.stock) {
            req.flash('error', `Only ${product.stock} items available in stock`);
            return res.redirect('/cart');
        }

        if (newQuantity > 0) {
            cartItem.productCount = newQuantity;
        } else {
            // If quantity is 0 or less, remove the item from the cart
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.productCount * item.productPrice, 0);
        cart.payableAmount = cart.totalPrice;

        await cart.save();

        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart quantity:', error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
};
