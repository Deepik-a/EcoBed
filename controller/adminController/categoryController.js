const categorySchema = require('../../model/categorySchema');

// Add a category
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new categorySchema({ name });
        await newCategory.save();
        
        // Send success response
        return res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        console.log(`Error while adding category: ${error}`);
        // Send error response
        return res.status(500).json({ message: 'Failed to add category' });
    }
};




const geteditCategories =async(req, res) => {
    try {
const categories = await categorySchema.find({});
        res.render('admin/Categorylist',{categories})
      
    } catch (error) {
        console.error('Error rendering edit category page:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Edit a category
const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Update the category by ID
        const updatedCategory = await categorySchema.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Send JSON response on successful update
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });

    } catch (error) {
        console.log(`Error while editing category: ${error}`);
        
        // Send JSON response on error
        res.status(500).json({ message: 'An error occurred while updating the category' });
   
    }
};


// Render the edit form for a specific category
const renderEditCategoryForm = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categorySchema.findById(id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Render the edit category form and pass the category details
        res.render('admin/editCategory', { category });
    } catch (error) {
        console.error('Error rendering edit category form:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Soft delete a category
const softDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categorySchema.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Category unlisted successfully' });
    } catch (error) {
        console.error(`Error while unlisting category: ${error}`);
        res.status(500).json({ message: 'Failed to unlist category' });
    }
};
// Get categories for user side (non-deleted)
const getCategoriesForUser = async (req, res) => {

    try {
      
        const categories = await categorySchema.find({ isDeleted: false });
        res.json(categories); // This sets the content type to application/json
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};





module.exports = {
    addCategory,
    editCategory,
    renderEditCategoryForm,
    softDeleteCategory,
    geteditCategories,
    getCategoriesForUser
  
};
