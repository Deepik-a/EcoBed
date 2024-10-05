const userSchema = require("../../model/userSchema");
const addressSchema = require("../../model/addressSchema");

//------------------------------------------- profile ----------------------------------------------

const profile = async (req, res) => {
  try {
    console.log(req.session.user);
  

    const userId = req.session.user;
    const userDetail = await userSchema.findById(userId);

    if (!userId) {
      return res.redirect("/login");
    }
    if (!userDetail) {
      return res.redirect("/");
    }
    res.render("user/userprofile", { userDetail });
  } catch (error) {
    console.log(`Error during profile page render ${error}`);
    res.status(404);
  }
};
//------------------------------------------- update profile ----------------------------------------------

const updatedProfile = async (req, res) => {
  console.log("entered pdatedProfile");
  try {
    const name = req.body.name;
    const phone = req.body.phone;
    const profileUpdate = await userSchema.findByIdAndUpdate(req.session.user, {
      name: name,
      phone: phone,
    });
    if (profileUpdate) {
      req.flash("success", "Profile updated");
      console.log("success");
    } else {
      console.log("failed");
      req.flash("error", "Could not update right now , please try again");
    }
    res.redirect("/userprofile");
  } catch (error) {
    console.log(`Error during updating the user profile ${error}`);
  }
};

//------------------------------- address management-----------------------------

const addAddress = async (req, res) => {
  try {
    const userAddress = {
      building: req.body.building,
      street: req.body.street,
      city: req.body.city,
      phone: req.body.phone,
      pincode: req.body.pincode,
      landmark: req.body.landmark,
      state: req.body.state,
      country: req.body.country,
    };
    const user = await userSchema.findById(req.session.user);
    user.address.push(userAddress);
    await user.save();

    console.log("success", "Address added");
    // Pass the entire user object to the EJS file
    res.render("user/userprofile", { userDetail: user });
  } catch (error) {
    req.flash("error", "Error While adding new address, Please try later");
    console.log(`Error during adding the user address ${error}`);
  }
};

//-------------------------------------- Remove Address ---------------------------------

const removeAddress = async (req, res) => {
  try {

    const userId = req.session.user;
    const index = parseInt(req.params.index, 10);

    const user = await userSchema.findById(userId)
        console.log("hloo",user);
    if (!user) {
      console.log("user not found");
        res.render('user/userprofile',)
    }

    if (isNaN(index) || index < 0 || index >= user.address.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('/profile');
    }
    const check=user.address.splice(index, 1);
    console.log("check",check);
   
    await user.save();
    console.log("useradress",user.address);
       // After deleting the address, pass the updated user and addresses to the front end
       res.render('user/userprofile', {
        userDetail: user, 
        success: 'Address deleted successfully',
      });



    console.log('success', 'Address deleted successfully');
 

  }catch (error) {
    console.log(`Error during deleting address${error}`);
    req.flash('error','Failed to delete address. Please try again later.');
  }
}


// --------------------------------------- Edit address page load ---------------------------------

const editAddress = async (req, res) => {
  try {
    const index = req.params.index; // Get the index from the URL parameter
    const user = await userSchema.findById(req.session.user); // Fetch the user from the database

    // Ensure the index is valid
    if (index < 0 || index >= user.address.length) {
      req.flash("error", "Invalid address index.");
      return res.redirect("/userprofile"); // Redirect to user profile if index is invalid
    }

    // Get the updated address details from the request body
    const updatedAddress = {
      building: req.body.building,
      street: req.body.street,
      city: req.body.city,
      phone: req.body.phone,
      pincode: req.body.pincode,
      landmark: req.body.landmark,
      state: req.body.state,
      country: req.body.country,
    };

    // Update the specified address in the user's address array
    user.address[index] = updatedAddress;

    // Save the user with the updated address
    await user.save();

    req.flash("success", "Address updated successfully.");
    res.redirect("/userprofile"); // Redirect to user profile after successful update
  } catch (error) {
    req.flash("error", "Error while updating the address. Please try again later.");
    console.log(`Error during updating the user address: ${error}`);
    res.redirect("/userprofile"); // Redirect to user profile on error
  }
};








module.exports = {
  profile,
  updatedProfile,
  addAddress,
  removeAddress,
  editAddress
};
