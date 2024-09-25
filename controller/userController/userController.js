const userSchema = require("../../model/userSchema");
const bcrypt = require("bcrypt");

const sendOTP = require("../../services/emailSender");
const generateotp = require("../../services/otpgenerator");

const user = (req, res) => {
  try {
    console.log('home');
    
    res.render("user/home");
  } catch (error) {
    console.log(`error while rendering the page ${error}`);
  }
};

const signup = (req, res) => {
  try {
    if (req.session.user) {
      res.render("user/Landingpage");
    } else {
      res.render("user/signup", {
        title: "Please Signup",
        user: req.session.user,
      });
    }
  } catch (error) {
    console.log(`error while renderin the page ${error}`);
  }
};

const signupPost = async (req, res) => {
  console.log(req.body)

  try {
    const details = {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      confirmpassword: await bcrypt.hash(req.body.confirmpassword, 10),
      phone: req.body.phone,

    };

    const check = await userSchema.findOne({ email: details.email });

    if (check) {
      res.render("user/signup");
    } else {
     const otp= generateotp()
      sendOTP(details.email,otp);
      req.session.otp = otp;
      req.session.otpTime = Date.now();
      req.session.email = details.email;
      req.session.name = details.name;
      req.session.phone = details.phone;
      req.session.password = details.password;
      console.log(`Submitted OTP: ${req.body.otp}`);
      console.log(`Session OTP: ${req.session.otp}`);
      res.redirect("/otp");
    }
  } catch (error) {
    console.log(`error while renderin the page ${error}`);
  }


};


const otp=(req,res)=>{
  try{
   res.render('user/otp',{title:'OTP Verified',email: req.session.email,  otpTime: req.session.otpTime,}) 
  }catch(error){
    console.log('error');
  }
}



//------------------------------------ verify the otp -------------------------------

const otppost=async(req,res)=>{
  // console.log("entered post");
  try{
    console.log("entered try");
    if(req.body.otp===req.session.otp){
      console.log("entered 1st if");
      const details = {
        name: req.session.name,
        email: req.session.email,
        password: await bcrypt.hash(req.session.password, 10),
        phone: req.session.phone,
      };
    await userSchema.insertMany([details])
    .then(()=>{
      console.log(`new user registeres successfully`)
      res.redirect('/login')
    }).catch((error)=>{
      console.log(`error while user signup ${error}`)
    })
    console.log("entered await");
    }else{
      res.redirect('/otp')
    }
 
  }catch (error) {
    console.log(`error while renderin the page ${error}`);
  }

}


//-------------------------------------- Otp Resent ---------------------------------

const otpResend=(req,res)=>{

  try{
const email=req.session.email
const otp=generateotp()
sendOTP(email,otp)
req.session.otp=otp
req.session.otpTime=Date.now()
console.log("OTP sent succesfully");
res.redirect('/otp')
  }catch(error){
    console.log(`error while resend otp ${error}`)
  }
}


const login = (req, res) => {
  if (req.session.user) {
    res.redirect('/home')
  } else {
    res.render('user/login', { title: 'Login', user: req.session.user })
  }
}

  
const loginpost=async (req,res)=>{
  console.log('loginpost');
  console.log(req.body);
  
  
  try{
    const user=await userSchema.findOne({email:req.body.email})
if(user){
  req.session.user = user; // Set session to render the userProfile
  console.log('User found and session set:', req.session.user);
  res.render('user/Landingpage')
}else{
  res.redirect('/login')
}
  }catch(error){
    console.log(`error while resend otp ${error}`)
  }
}

const logout = (req, res) => {
  try {
    req.session.destroy(error => {
      if (error) {
        console.log(`error while logout ${error}`)
      }
    })
    res.redirect('/')
  } catch (error) {
    console.log(`error while logout user ${error}`)
  }
}






module.exports = {
  user,
  signup,
  signupPost,
  otp,
  otppost,
otpResend,
login,
loginpost,
logout
};
