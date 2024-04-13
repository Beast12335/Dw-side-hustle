const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  }
});
const orders = mongoose.model('orders',schema)
module.exports = orders
