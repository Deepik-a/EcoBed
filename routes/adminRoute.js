const express=require('express')
const admin=express.Router()
const adminController=require('../controller/adminController/adminController')
const userController=require('../controller/adminController/usercontroller')
const categoryController = require('../controller/adminController/categoryController');
const  productController = require('../controller/adminController/productController');
const multerUpload = require('../middleware/multer');






//--------------------------------admin login----------------------------
admin.get('/',adminController.admin)
admin.get('/login',adminController.adminlogin)
admin.post('/login',adminController.adminloginpost)



//--------------------------------UserManagment----------------------------
admin.get('/users',adminController.listuser)
admin.get('/block/:id',adminController.blockUser)
admin.get('/unblock/:ideee',adminController.unblockUser)


//--------------------------------CategoryManagment----------------------------
admin.get('/addCategory', adminController.getCategories);
admin.post('/addCategory', categoryController.addCategory);
admin.get('/editCategory', categoryController.geteditCategories);
admin.get('/editCategory/:id', categoryController.renderEditCategoryForm);
admin.post('/editCategory/:id', categoryController.editCategory);
admin.delete('/delete/:id', categoryController.softDeleteCategory);
admin.get('/categories', categoryController.getCategoriesForUser);


// //--------------------------------ProductManagment----------------------------
admin.get('/addProduct', productController.getProduct);
admin.post('/addProduct', multerUpload,productController.addProduct);
admin.get('/editProduct', productController.geteditProduct);
admin.post('/editProduct/:id', productController.editProduct);


// // admin.delete('/delete/:id', categoryController.softDeleteCategory);

// // admin.get('/categories', categoryController.getCategoriesForUser);








module.exports=admin