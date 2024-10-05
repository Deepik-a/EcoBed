const userSchema = require('../model/userSchema')


// -------------------- check user is login or not  ------------------------

async function checkUser(req, res, next) {
  try {
    if (req.session.user) {
      const userDetails = await userSchema.findById(req.session.user);
      if (userDetails && userDetails.isActive) {
        // Attach user details to res.locals
        res.locals.user = userDetails; // This makes user available in all views
        return next();
      } else {
        req.session.user = null;
        return res.redirect('/login');
      }
    } else {
      // If no user session, set user to null in res.locals
      res.locals.user = null;
      next();
    }
  } catch (err) {
    console.log(`Error in checkUser Middleware: ${err}`);
    next(err);
  }
}




module.exports = checkUser