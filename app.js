const express=require('express')
const app=express()
const path=require("path")
const expressLayouts=require('express-ejs-layouts')
const flash = require('connect-flash')
const session=require('express-session')


const dotenv=require('dotenv').config()



const connectdb=require('./config/connection')
//--------------------- mongodb connection ---------------------

connectdb();




//----------------------- Requiring Routes -------------------------
const adminRoutes=require('./routes/adminRoute')
const userRoutes=require('./routes/userRoute')


//--------------------- Setting view engine --------------------
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

//layout folder


//-----------------------public static files -------------------

app.use('/public',express.static(path.join(__dirname,'public')))


//------------------------- url encoded data -------------------
//--------------------------- middlewares -----------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))





//--------------------------- session handling -----------------------
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));
  

// Flash setup
app.use(flash());

app.use(expressLayouts);
app.set('layout', 'layouts/layout');



const port=process.env.PORT || 3000


app.use('/',userRoutes)
app.use('/admin',adminRoutes)



app.listen(port,()=>{
console.log(`http://localhost:${port}`);
})