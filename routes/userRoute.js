const express=require('express')
const route=express.Router()

const userController=require("../controller/userController/userController")


const productController=require("../controller/userController/productController")
const categoryController=require("../controller/userController/categoryController")
const profileController=require('../controller/userController/profileController')
/*-------------------------------------main page-----------------*/
route.get('/',userController.user)



/*-------------------------------------signup-----------------*/
route.get('/signup',userController.signup)
route.post('/signup',userController.signupPost)


route.get('/otp',userController.otp)
route.post('/otp',userController.otppost)

route.get('/resend',userController.otpResend)


route.get('/login',userController.login)

route.post('/login',userController.loginpost)

route.get('/logout',userController.logout)



// //---------------------------------- Cart ------------------------

// route.get('/cart',cartController.cartPage)



// //---------------------------------- wishlist------------------------

// route.get('/wishlist',wishlistController.wishlistPage)



// //---------------------------------- Order  ------------------------

// route.get('/buynow',  orderController.orderPage);


//---------------------------------- Category------------------------

// route.get('/category/bedfurnishers',categoryController.categoryPage)
route.get('/products', categoryController.getAllProductsGroupedByCategory);





//---------------------------------- Product------------------------
route.get('/products', productController.getAllProducts);
// route.get('/productdetail',productController.getProductDetails)


 //--------------------------------UserProfile----------------------------
route.get('/userprofile',profileController.profile)
route.post('/update-profile',  profileController.updatedProfile);
route.post('/add-address', profileController.addAddress);
route.post('/delete-address/:index',profileController.removeAddress)
route.post('/edit-address',profileController.editAddress)


module.exports = route;