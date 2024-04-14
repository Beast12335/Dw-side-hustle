const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  balance: {
    type: Integer,
    required: true,
  },
});
const pointsModel = mongoose.model('points',schema)
module.exports = pointsModel
