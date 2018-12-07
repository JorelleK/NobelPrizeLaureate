
# PROJECT NAME

---

Name: Jorelle Kebeto Yonta

Date: 12/7/2018

Project Topic: Nobel Prize Laureates

URL:

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     firstname       `Type: String`
- `Field 2`:     surname       `Type: String`
- `Field 3`:     bornCountry       `Type: String`
- `Field 4`:     gender          `Type: String`
- `Field 5`:     prizes         `Type:Array``([{year: type:number, category: type String, motivation: type:String}])`
- `Field 6`:     affiliation     `Type:Array``([{name: type:String, city: type String, country: type:String}])`


Schema:
```javascript
{
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

}
```

### 2. Add New Data

HTML form route: `/addlaureate`

POST endpoint route: `/api/addlaureate`


### 3. View Data

GET endpoint route: `/api/getlaureate`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

Navigation Filters
1. Nobel Prize facts -> `  /facts  `
2. Select Category -> `  /laureat/category  `
3. Recent Laureates -> `  /recent  `
4. Awarded Women -> `  /women  `
5. Add New Laureate -> `  /addlaureate `
