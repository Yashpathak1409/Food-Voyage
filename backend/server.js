require('dotenv').config(); // Load the environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());

// MongoDB connection using the environment variable from .env file
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Recipe Store Schema
const recipeStoresSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

// Create Models
const User = mongoose.model('User', userSchema);
const RecipeStores = mongoose.model('Recipestores', recipeStoresSchema, 'Recipestores');

// Secret key for token generation from environment variables
const SECRET_KEY = process.env.SECRET_KEY;

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Middleware to authenticate token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId;
    next();
  });
};

// Recipe Stores CRUD Operations
app.post('/api/recipestores', authenticate, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const newRecipeStore = new RecipeStores(req.body);
    await newRecipeStore.save();
    
    // Fetch and return the updated list
    const updatedRecipeStores = await RecipeStores.find();
    res.status(201).json(updatedRecipeStores);
  } catch (error) {
    console.error('Error adding recipe store:', error.message);
    res.status(500).json({ message: 'Error adding recipe store', error: error.message });
  }
});

app.get('/api/recipestores', async (req, res) => {
  try {
    const recipeStores = await RecipeStores.find();
    res.status(recipeStores.length ? 200 : 404).json(recipeStores.length ? recipeStores : { message: 'No recipe stores found' });
  } catch (error) {
    console.error('Error fetching recipe stores:', error);
    res.status(500).json({ message: 'Error fetching recipe stores' });
  }
});

app.get('/api/recipestores/:id', async (req, res) => {
  try {
    const recipeStore = await RecipeStores.findById(req.params.id);
    res.status(recipeStore ? 200 : 404).json(recipeStore || { message: 'Recipe store not found' });
  } catch (error) {
    console.error('Error fetching recipe store:', error);
    res.status(500).json({ message: 'Error fetching recipe store' });
  }
});

app.delete('/api/recipestores/:id', authenticate, async (req, res) => {
  try {
    const recipeStore = await RecipeStores.findByIdAndDelete(req.params.id);
    res.status(recipeStore ? 200 : 404).json(recipeStore ? { message: 'Recipe store deleted successfully' } : { message: 'Recipe store not found' });
  } catch (error) {
    console.error('Error deleting recipe store:', error);
    res.status(500).json({ message: 'Error deleting recipe store' });
  }
});

// Start the server
const PORT = process.env.PORT || 6409;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});