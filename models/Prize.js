var mongoose = require('mongoose');
var PrizeSchema = mongoose.Schema;
var prizeSchema = new PrizeSchema({
  year: {
      type: Number,
      min: 0,
      max: 2018,
      required: true
  },
    category: {
        type: String,
        required: true
    },
    motivation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Prize', prizeSchema);
