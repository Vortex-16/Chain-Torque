// Simple in-memory user store for development
const users = new Map();

class InMemoryUserStore {
  constructor() {
    // Add a demo user for testing
    this.addUser({
      id: '1',
      fullName: 'Demo User',
      email: 'demo@chaintorque.com',
      password: 'password123', // In real app, this would be hashed
      userType: 'buyer',
      phoneNumber: '+1234567890',
      organization: 'ChainTorque Demo'
    });
  }

  addUser(user) {
    users.set(user.email, { ...user, id: users.size + 1 });
    return user;
  }

  findByEmail(email) {
    return users.get(email);
  }

  findById(id) {
    for (let user of users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  updateUser(email, updates) {
    const user = users.get(email);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return null;
  }

  getAllUsers() {
    return Array.from(users.values());
  }
}

module.exports = new InMemoryUserStore();
