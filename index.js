var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./laureate-data-util");
var _ = require('underscore');
var mongoose = require('mongoose');
var request = require('request');
var Laureates = require('./models/Laureates');
var Prize = require('./models/Prize');
//var dotenv = require('dotenv');

var _DATA = dataUtil.loadData().laureates;
var name = []
var app = express();

//dataUtil.restoreOriginalData();
//dotenv.load();

//connect to mlab database (set up mongoose connection)
var db = "mongodb://joma:finalproject1@ds235461.mlab.com:35461/myproject";
console.log(db);

var promise = mongoose.connect(db, {useNewUrlParser: true});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

 //homepage
  app.get('/', function(req, res) {
      // Get all laureates
      var nobel = "Nobel Prizes"
      var category = [] ;
      var people = [];

      for(var i=0; i<_DATA.length; i++){

                   category.push(_DATA[i].prizes[0].category)

                   if(_DATA[i].firstname === ""){
                     people.push(_DATA[i].surname)
                   }else{
                   people.push(_DATA[i].firstname)
                 }
      }
   res.render('laureates', {
     people: people,
     category: category,
     nobel: nobel,
   })

  });

//html form
app.get('/addlaureate', function(req,res){
  var title =""
  //update the laureate

 res.render('laureateform', {title: "Add new Laureate"})
   //res.render('prizeform',{title: "Add Prize Info"})
});

 app.post('/addlaureate', function(req, res) {   //post endpoint
     // Create new laureate
     var laureate = new Laureates({
       firstname: req.body.firstname,
       surname: req.body.surname,
       bornCountry: req.body.bornCountry,
       gender: req.body.gender,
       prizes: [],
       affiliation: []
     });

   laureate.save(function(err) {
      if (err) throw err;

      res.send('Succesfully inserted new laureate.');
  });

 });

 //add prizes
 app.post("/awards/:id", function(req,res){


   Laureates.findOne({ _id: req.params.id }, function(err, laureate) {
        if (err) throw err;
        if (!laureate) return res.send('No movie found with that ID.');

        laureate.prizes.push({
            year: parseInt(req.body.year),
            category: req.body.category,
            motivation: req.body.motivation
        });

        laureate.affiliation.push({
          name: req.body.name,
          city: req.body.city,
          country: req.body.country
        });

        laureate.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully added prize and affiliation info.');
        });

      });

 });

 app.get("/awards/:id/info", function(req,res){
   var id = req.params.id;
   res.render("prizeform", {
     title:"Add a prize info for this laureate",
     id: id,
   })
 })
 /*app.get("/awards/:id/affiliation", function(req,res){
   var id = req.params.id;
   res.render('affiliation', {
     title:"Add the affiliation info for this laureate",
     id: id,
   })
 })*/

// Get all laureates added to database
 app.get('/awards', function(req, res) {

     Laureates.find({}, function(err, laureates) {
    if (err) throw err;
     res.send(laureates);
   });
   //res.render('prizeform');
 });

 app.get('/search', function(req,res, next){
   var name = [];

   for(var i=0; i<_DATA.length; i++){
        name.push(_DATA[i].firstname)
   }

    res.render('namesearch',{
      name: name,
    })

 })

 /*app.get('/addprize', function(req,res){
   var title =""
  //res.render('laureateform',{title: "Add new Laureate"})
    res.render('prizeform', {title: "Add Prize Info"})
 });
 /*var laureate = new Laureates({
 firstname: req.body.firstname,
 surname: req.body.surname,
 bornCountry: req.body.bornCountry,
 gender: req.body.gender,
 prizes: [],
 affiliations: []
 });*/

 // Save laureate to database
 /*laureate.save()
   .then(item => {
     res.render('laureates', {title: "Laureate saved to database"});
   })
   .catch(err => {
        res.status(400).send("Unable to save to database");
    });*/
 //api post request
 app.post("/api/addlaureate", function(req, res) {

request.post({
  method: 'POST',
  url: 'http://localhost:3000/api/addlaureate',
  headers: {
      'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    firstname: req.body.firstname,
    surname: req.body.surname,
    gender: req.body.gender,
    bornCountry: req.body.bornCountry
  }
}, function(error, response, body){
  console.log(body);
});

res.send(req.body);
});


 //get all the info on a specific laureates
 app.get('/name/:name', function(req,res){
   var name = req.params.name;
   var surname;
   var category;
   var gender;
   var school;
   var prize_year;
   var year_of_birth;
   var borncountry;
   var motivation;

     for(var i=0; i<_DATA.length; i++){

       if (_DATA[i].firstname === name){

          category = _DATA[i].prizes[0].category
          gender = _DATA[i].gender
          surname = _DATA[i].surname
          year_of_birth = _DATA[i].born
          borncountry = _DATA[i].bornCountry
          motivation = _DATA[i].prizes[0].motivation
          school = _DATA[i].prizes[0].affiliations[0].name
          prize_year = _DATA[i].prizes[0].year
   }
 }

res.render('specificinfo', {
  name: name,
  surname: surname,
  category: category,
  prize_year: prize_year,
  gender: gender,
  year_of_birth: year_of_birth,
  borncountry: borncountry,
  motivation: motivation,
  school: school,
})

});
//display all laureates and their category as json object
 app.get('/api/getlaureate', function(req,res){
   var laureate = {};

   var name = [];
   var category = [];

   for (var i=0; i<_DATA.length; i++){

             name.push(_DATA[i].firstname);
             category.push(_DATA[i].prizes[0].category);

   }
   name.forEach((key, i) => laureate[key] = category[i]);

     res.send(laureate);

 });

 app.get('/laureat/:category', function(req, res){
   var categor = req.params.category;
   var category = [];
   var peopl = [];

   var cat="";

     for(var i=0; i <_DATA.length; i++){

           if (!category.includes(_DATA[i].prizes[0].category)){

                 category.push(_DATA[i].prizes[0].category)
           }
   }
   res.render('category', {
     categor: categor,
     category: category,

   })

 });

 app.get('/laureat/category/:catname',function(req,res){
    var categor = req.params.catname;
    var peopl = [];
    var born = [];
    var years =[];
    var gender=[];
    var count;
    for(var i=0; i <_DATA.length; i++){

          if (_DATA[i].prizes[0].category === categor ){

             peopl.push(_DATA[i].firstname);
             born.push(_DATA[i].born)
             years.push(_DATA[i].prizes[0].year)
             gender.push(_DATA[i].gender)
          }
    }
      count = peopl.length;

  res.render('people', {
    peopl: peopl,
    categor: categor,
    born: born,
    years: years,
    gender: gender,
    count: count,

  })
});

app.get('/facts', function(req,res){

  var categor = req.params.catname;
  var peopl = [];
  var med=[], chem= [], lit=[];
  var count, countw=0, countwm=0, countm=0;
  var countc=0, countwc=0, countl =0, countwl=0;
  for(var i=0; i <_DATA.length; i++){

        if (_DATA[i].prizes[0].category === "physics" ){
           peopl.push(_DATA[i].firstname);

           if (_DATA[i].gender === "female" ){
              countw++;
           }
        }

        if (_DATA[i].prizes[0].category === "medicine" ){
           med.push(_DATA[i].firstname);

           if (_DATA[i].gender === "female" ){
              countwm++;
           }
        }

        if (_DATA[i].prizes[0].category === "chemistry" ){
           chem.push(_DATA[i].firstname);

           if (_DATA[i].gender === "female" ){
              countwc++;
           }
        }

        if (_DATA[i].prizes[0].category === "literature" ){
           lit.push(_DATA[i].firstname);

           if (_DATA[i].gender === "female" ){
              countwl++;
           }
        }

  }
    count = peopl.length;
    countm = med.length;
    countc = chem.length;
    countl = lit.length;

res.render('facts', {
  peopl: peopl,
  count: count,
  countw: countw,
  countm: countm,
  countwm: countwm,
  countc: countc,
  countwc: countwc,
  countl: countl,
  countwl: countwl,

})

});

// display all laureat from 2013 to 2018
 app.get('/recent', function(req,res){
   var recent = req.params.recent;
   var name = [];
   var years =[];
   var gender = [];
   var category = [];
   var born = [];

   for(var i=0; i <_DATA.length; i++){

         if (parseInt(_DATA[i].prizes[0].year) < 2019 &&  parseInt(_DATA[i].prizes[0].year) >= 2013 ){

            category.push(_DATA[i].prizes[0].category)
            name.push(_DATA[i].firstname);
            born.push(_DATA[i].born)
            years.push(_DATA[i].prizes[0].year)
            gender.push(_DATA[i].gender)
         }
 }

 res.render('recentlaureate', {
   name: name,
   category: category,
   born: born,
   years: years,
   gender: gender,

 })

 });
 app.get('/women', function(req,res){
   var name = [];
   var years =[];
   var gender = [];
   var category = [];
   var born = [];

   for(var i=0; i <_DATA.length; i++){

         if (_DATA[i].gender === "female"){

            category.push(_DATA[i].prizes[0].category)
            name.push(_DATA[i].firstname);
            born.push(_DATA[i].born)
            years.push(_DATA[i].prizes[0].year)
            gender.push(_DATA[i].gender)
         }
 }

 res.render('womenlaureate', {
   name: name,
   category: category,
   born: born,
   years: years,
   gender: gender,

 })

 });



 app.listen(3000, function() {
     console.log('App listening on port 3000!');
 })

 module.exports = app;
