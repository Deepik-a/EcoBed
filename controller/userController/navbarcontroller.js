const productSchema = require('../../model/productSchema')
const categorySchema = require('../../model/categorySchema');
const mongoose = require('mongoose')

//----------------------------------- Home page render --------------------------------

const home = async (req, res) => {
  try {
  
    const product = await productSchema.find({ isActive : true })    
    const categories=await categorySchema.find({isDeleted:false})
    res.render('user/home', { categories, product, user: req.session.user})
  } catch (error) {
    console.log(`error while rendering home ${error}`)
  }
}


module.exports = { home }

