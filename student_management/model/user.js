const mongoose = require('mongoose');
const { ROLES, STATUS } = require('../utils/constants');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
name : String,
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.STUDENT
  },

  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.INVITED
  },

  provider: String, // google
  googleId : String,
  refreshToken: String,
  accessToken: String,
  tokenExpiry: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);