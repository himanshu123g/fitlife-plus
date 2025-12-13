// Mock Database System - Works without MongoDB
// Provides immediate functionality while MongoDB issues are resolved

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.sessions = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample products
    const sampleProducts = [
      {
        _id: 'prod1',
        name: 'Whey Protein Powder',
        brand: 'FitLife',
        category: 'Protein',
        price: 2999,
        imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Whey+Protein',
        description: 'High-quality whey protein for muscle building and recovery',
        stock: 50
      },
      {
        _id: 'prod2',
        name: 'Creatine Monohydrate',
        brand: 'FitLife',
        category: 'Performance',
        price: 1499,
        imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Creatine',
        description: 'Pure creatine monohydrate for enhanced performance',
        stock: 30
      },
      {
        _id: 'prod3',
        name: 'BCAA Capsules',
        brand: 'FitLife',
        category: 'Recovery',
        price: 1999,
        imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=BCAA',
        description: 'Essential branched-chain amino acids for faster recovery',
        stock: 25
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product._id, product);
    });

    console.log('✅ Mock database initialized with sample data');
  }

  // User operations
  createUser(userData) {
    const userId = 'user_' + Date.now();
    const user = { _id: userId, ...userData, createdAt: new Date() };
    this.users.set(userId, user);
    return user;
  }

  findUser(query) {
    for (let [id, user] of this.users) {
      if (query.email && user.email === query.email) return user;
      if (query._id && user._id === query._id) return user;
    }
    return null;
  }

  // Product operations
  getAllProducts() {
    return Array.from(this.products.values());
  }

  getProduct(id) {
    return this.products.get(id);
  }

  // Order operations
  createOrder(orderData) {
    const orderId = 'order_' + Date.now();
    const order = { _id: orderId, ...orderData, createdAt: new Date() };
    this.orders.set(orderId, order);
    return order;
  }

  getUserOrders(userId) {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }
}

// Global mock database instance
const mockDB = new MockDatabase();

module.exports = mockDB;