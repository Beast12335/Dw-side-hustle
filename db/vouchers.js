const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },

  valid: {
    type: String,
    required: true,
  },
  date:{
    type: String,
    required: true,
  }
});
const vouchers = mongoose.model('vouchers',schema)
module.exports = vouchers
