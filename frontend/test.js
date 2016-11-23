var gm = require('googlemaps');
var util = require('util');
var http = require('http');
var express = require('express');
var session = require('express-session');
var path = require('path');
var bpar = require('body-parser');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');

var app = express();

app.set('views',path.join(__dirname,'public'));
app.set('view engine','jade');

app.use(express.static(path.join(__dirname,'public'))); //to fetch the js
app.use(bpar.json()); // for parsing application/json
app.use(bpar.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer());//needed for console.log(req.body) to print json
gm.config('secure',true)
gm.config('console-key','SOMEKEY')

markers = [
    { 'location': '300 W Main St Lock Haven, PA' },
    { 'location': '444 W Main St Lock Haven, PA',
        'color': 'red',
        'label': 'A',
        'shadow': 'false',
        'icon' : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
    }
]

styles = [
    { 'feature': 'all', 'element': 'all', 'rules':
        { 'hue': '0x00ff00' }
    }
]

paths = [
    { 'color': '0x0000ff', 'weight': '5', 'points':
        [ '41.139817,-77.454439', '41.138621,-77.451596' ]
    }
]



var db_url = "mongodb://localhost:27017/test"
var monk = require('monk');
var db = monk('localhost:27017/test');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/', function (req, res) {

  res.sendFile('/index.html');
  res.send();
})

app.get('/users', function(req,res) {

  var db = req.db;
    var collection = db.get('test');
    collection.find({},{},function(e,docs){
        if(!e) {
          console.log("Got something")
          res.render('viewUsers', {
              "userlist" : docs
          });
        } else {
          res.send(e)
        }
    });
})
// accept POST request on the homepage
app.post('/loc', function (req, res) {


//print a map via google static maps

  //var mainResp = res;
  console.log(req.headers)
  console.log(req.body);
  var sloc = req.body.la + "," + req.body.lo;
  gm.reverseGeocode(sloc,  function(err, data){

    var addr = data.results[0].formatted_address
    console.log(addr)
    //console.log("-----------------------")
    //console.log(data.results[0].geometry)
  //  console.log("-----------------------")
    //console.log(data)
    markers = [
        { 'location': addr,
            'color': 'red',
            'label': 'A',
            'shadow': 'false',
            'icon' : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
        }
    ]

    var t = gm.staticMap(addr, 19, '500x400',false, false, 'roadmap', markers, styles, paths);

    /*mainResp.write('<html>')
    mainResp.write('<body>')
    mainResp.write('<img style="-webkit-user-select: none; cursor: zoom-in;" src="'+ t + '" width="458" height="367">')
    mainResp.write('</body>')
    mainResp.write('</html>')
    mainResp.send();*/

    // Connect to the db
    MongoClient.connect(db_url, function(err, db) {
      if(!err) {
        console.log("mongodb -- We are connected");
        var collection = db.collection("test");
        var myip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var entry = {
          datetime: new Date() , initials: req.body['initials'], ip: myip, lat:req.body.la, long: req.body.lo,fname: "", lname: "", mapurl: t
        };
        collection.insert(entry,{w:1},function(err,result) {
          if(!err){
            console.log("success inserting data!!")
            res.send(
              "<!DOCTYPE html>" +
              "<html>" +
                "<head>" +
                  '<meta name="viewport" content="width=device-width">' +
                "</head>" +
                "<body>" +
                  "<h1>Successfully logged</h1>" +
                 "</body>" +
              "</html>"
            );
          } else {
            console.log("error inserting data!!")
          }
        });
      }
    });
  }); //reverseGeocode

});

app.get('/gethotel',function(req,res) {
  var url = "https://hacker235:pBo8BAC2Xu@distribution-xml.booking.com/json/getHotelAvailabilityV2?" +
  "output=room_policies,room_details,hotel_details&checkin=2016-10-10&checkout=2016-10-11&city_ids=-2437894&room1=A,A&rows=10" 
 // +   "&latitude=" + req.query.lat + "&longitude=" + req.query.lng + "&radius=" + req.query.rad; //&city_ids=-2437894


  console.log("gethotel");


  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          console.log(body) // Print the json response
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(body));
      } else {
        console.log("error!! statusCode " + response.statusCode);
      }
  })

});
app.get('/gethotelReviews',function(req,res) {
  //console.log(req.query.hid);
  var url = "https://hacker235:pBo8BAC2Xu@distribution-xml.booking.com/json/bookings.getBookingcomReviews?hotel_ids=" + req.query.hid;

  console.log("gethotelReviews");


  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          console.log(body) // Print the json response
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(body));
      } else {
        console.log("error!! statusCode " + response.statusCode);
      }
  })

});


app.post('/next',function(req,res) {

  res.redirect('/index_1.html');

});
app.post('/db',function(req,res) {
  res.send("At the DB")

});

// accept PUT request at /user
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

// accept DELETE request at /user
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
})
var server = app.listen(443);
