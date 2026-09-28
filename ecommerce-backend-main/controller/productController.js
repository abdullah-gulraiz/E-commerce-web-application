const Product = require('../model/product');

const addProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res
        .status(400)
        .json({ message: 'Title, description, price and category are required.' });
    }

    const images = (req.files || []).map((file) => file.path);

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      image: images,
    });

    const savedProduct = await newProduct.save();
    const populated = await Product.findById(savedProduct._id).populate(
      'category',
      'name'
    );
    res.status(201).json(populated);
  } catch (error) {
    console.error('addProduct error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Build update object explicitly so unknown fields can't be smuggled in.
    const { title, description, price, category } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;

    // Only overwrite images if new ones were uploaded.
    if (req.files && req.files.length > 0) {
      updates.image = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('category', 'name');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Return the id so the Redux slice can filter by _id.
    res.json({ message: 'Product deleted successfully', _id: req.params.id });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select('title price image category')
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    console.error('getAllProducts error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productById = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('reviews.user', 'name');
    if (!productById) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(productById);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.userId;

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({ message: 'Review comment is required.' });
    }
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.reviews.push({ user: userId, rating: numericRating, comment: comment.trim() });
    await product.save();

    // Return the updated product so the UI can refresh immediately.
    const populated = await Product.findById(productId)
      .populate('category', 'name')
      .populate('reviews.user', 'name');
    res.json(populated);
  } catch (error) {
    console.error('addReview error:', error);
    res.status(500).json({ message: error.message });
  }
};

const userSearchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }
    // Escape regex special chars so a user searching for "$50" doesn't blow up.
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const products = await Product.find({
      $or: [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ],
    })
      .select('title price image category')
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    console.error('userSearchProducts error:', error);
    res.status(500).json({ message: error.message });
  }
};

const userFilterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .select('title price image category')
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    console.error('userFilterProducts error:', error);
    res.status(500).json({ message: error.message });
  }
};

const productPagination = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .select('title price image category')
        .populate('category', 'name')
        .skip(skip)
        .limit(limit),
      Product.countDocuments(),
    ]);

    res.json({
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('productPagination error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  userSearchProducts,
  userFilterProducts,
  productPagination,
};
