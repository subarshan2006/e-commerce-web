const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Cleared existing data...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
      phone: '+1234567890',
      address: {
        street: '123 Admin Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    });

    console.log('Admin user created:', adminUser.email);

    // Create sample products
    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
        price: 149.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        stock: 50,
        brand: 'AudioTech',
        rating: 4.5,
        numReviews: 128,
        isFeatured: true
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance.',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        stock: 35,
        brand: 'TechFit',
        rating: 4.7,
        numReviews: 89,
        isFeatured: true
      },
      {
        name: 'Classic Leather Backpack',
        description: 'Handcrafted genuine leather backpack with laptop compartment and multiple pockets.',
        price: 89.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        stock: 75,
        brand: 'LeatherCraft',
        rating: 4.3,
        numReviews: 45,
        isFeatured: true
      },
      {
        name: 'Portable Coffee Maker',
        description: 'Compact espresso maker perfect for travel, camping, or office use. Makes perfect coffee anywhere.',
        price: 59.99,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
        stock: 100,
        brand: 'BrewMaster',
        rating: 4.6,
        numReviews: 212,
        isFeatured: true
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Extra thick eco-friendly yoga mat with carrying strap. Non-slip surface for all yoga styles.',
        price: 39.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
        stock: 120,
        brand: 'YogaPro',
        rating: 4.4,
        numReviews: 67,
        isFeatured: false
      },
      {
        name: 'Gaming Mouse RGB',
        description: 'Professional gaming mouse with customizable RGB lighting and programmable buttons.',
        price: 79.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
        images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
        stock: 60,
        brand: 'GameTech',
        rating: 4.8,
        numReviews: 156,
        isFeatured: true
      },
      {
        name: 'Sunglasses Classic',
        description: 'Timeless aviator sunglasses with UV protection and polarized lenses.',
        price: 119.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
        stock: 85,
        brand: 'StyleVision',
        rating: 4.2,
        numReviews: 34,
        isFeatured: false
      },
      {
        name: 'Portable Speaker Waterproof',
        description: 'Rugged waterproof Bluetooth speaker with 20-hour battery life and powerful bass.',
        price: 69.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        stock: 90,
        brand: 'SoundWave',
        rating: 4.5,
        numReviews: 98,
        isFeatured: true
      }
    ];

    const products = await Product.insertMany(sampleProducts);

    console.log(`${products.length} sample products created`);
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
