var mongoose = require('mongoose');
var LaureateSchema = mongoose.Schema;
var prizeSchema = new mongoose.Schema({
  year: {
      type: Number,
      min: 0,
      max: 2018,
      required: false
  },
    category: {
        type: String,

    },
    motivation: {
        type: String,

    }
});
var affiliationSchema = new mongoose.Schema({
   name: {
      type: String,

  },
  city: {
     type: String,

 },
 country: {
    type: String,

}
});
var laureateSchema = new LaureateSchema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    bornCountry: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    prizes: [prizeSchema],
    affiliation: [affiliationSchema]

});

module.exports = mongoose.model('Laureates', laureateSchema);
