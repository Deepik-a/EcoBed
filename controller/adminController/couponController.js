const Coupon = require('../../model/couponSchema');

//------------------------------------- Get all coupons ---------------------------

const getCoupons = async (req, res) => {
    const search = req.query.search || '';
    try {
        if (req.params.id) {
            const coupon = await Coupon.findById(req.params.id);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found' });
            }
            return res.json(coupon);
        }
        const coupons = await Coupon.find({code: { $regex: search, $options: 'i' }})
         

        const count = await Coupon.countDocuments({ code: { $regex: search, $options: 'i' } })



        res.render('admin/coupons', { coupons, title: 'Coupons' });
    } catch (error) {
        console.log(`Error while rendering coupon page: ${error}`);
        res.status(500).json({ message: 'Error fetching coupon data' });
    }
};
//--------------------------------- Add a new coupon -----------------------------

const addCoupon = async (req, res) => {
    const { code, discountType, discountValue, startDate, endDate, minimumOrderAmount } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate || !minimumOrderAmount) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            startDate,
            endDate,
            minimumOrderAmount
        });

        await newCoupon.save();
        res.json({ message: 'Coupon added successfully' });
    } catch (error) {
        console.error('Error adding coupon:', error);
        res.status(500).json({ message: 'Error adding coupon' });
    }
};


//------------------------------------- Edit a coupon ----------------------------

const editCoupon = async (req, res) => {
    const { id, code, discountType, discountValue, startDate, endDate, minimumOrderAmount } = req.body;
    if (!id || !code || !discountType || !discountValue || !startDate || !endDate || minimumOrderAmount === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id, { code, discountType, discountValue, startDate, endDate, minimumOrderAmount }, { new: true }
        );
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json({ message: 'Coupon updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating coupon' });
    }
};


//----------------------------- Toggle coupon status ----------------------------

const toggleCouponStatus = async (req, res) => {
    const couponId = req.query.id;
    const status = req.query.status === 'true';
    try {
        await Coupon.findByIdAndUpdate(couponId, { isActive: !status });
        req.flash('error','Coupon status updated successfully')
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log(`Error while changing status: ${error}`);
        res.flash('error' ,'Error updating coupon status' );
    }
};

//--------------------------------- Delete a coupon ------------------------------

const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        await Coupon.findByIdAndDelete(id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon' });
    }
};



module.exports = { getCoupons , addCoupon , editCoupon , toggleCouponStatus , deleteCoupon}