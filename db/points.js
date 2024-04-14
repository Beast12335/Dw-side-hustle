const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  balance: {
    type: Number,
    required: true,
  },
  made_by:{
    type:String,
  },
});
const pointsModel = mongoose.model('points',schema)
module.exports = pointsModel
