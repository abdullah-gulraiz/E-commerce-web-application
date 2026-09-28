const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {addReview, addProduct, updateProduct, deleteProduct, getAllProducts, getProductById, userSearchProducts , userFilterProducts , productPagination} = require('../controller/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
router.get('/all', getAllProducts);
router.get('/search', userSearchProducts);
router.get('/filter', userFilterProducts);
router.get('/pagination', productPagination);
router.get('/:id', getProductById);
router.use(authMiddleware);

//admin routes
router.post('/add', adminMiddleware, upload.array('image', 5), addProduct);
router.put('/update/:id', adminMiddleware, upload.array('image', 5), updateProduct);
router.delete('/delete/:id', adminMiddleware, deleteProduct);
//user routes
router.post('/review/:id', addReview);

module.exports = router;