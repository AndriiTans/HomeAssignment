const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const UserSchema = require('../schemas/user.schema');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class UserModel {
  constructor() {
    this.ensureFileExists();
  }

  async ensureFileExists() {
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
    }
  }

  async getUsers() {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data).users;
  }

  async findByEmail(email) {
    const users = await this.getUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(userData) {
    const validation = UserSchema.validate(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const users = await this.getUsers();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const formattedUser = UserSchema.format({
      ...userData,
      password: hashedPassword,
    });

    users.push(formattedUser);
    await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2));

    const { password, ...userWithoutPassword } = formattedUser;
    return userWithoutPassword;
  }

  async validateUser(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserModel();
