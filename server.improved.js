const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      express = require('express'),
      bodyParser = require("body-parser");
      app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/submit', function(request, response){
  
  var reading = request.body;
  updateRecord(reading).then(function(resolve){
    console.log(resolve)

    response.writeHeader( 200, { 'Content-Type': 'text/plain' })
    response.end("Ok");
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const calculateAggr = function(data){
  let aggregate = {
    "Park":{"sum":0,"count":0},
    "Reverse":{"sum":0,"count":0},
    "1st Gear":{"sum":0,"count":0},
    "2nd Gear":{"sum":0,"count":0},
    "3rd Gear":{"sum":0,"count":0},
    "4th Gear":{"sum":0,"count":0},
    "5th Gear":{"sum":0,"count":0},
    "6th Gear":{"sum":0,"count":0},
  }

  data.readings.forEach(re => {
    aggregate[re.gear].sum = Number(aggregate[re.gear].sum) + Number(re.speed)
    aggregate[re.gear].count = Number(aggregate[re.gear].count) + 1 
  });

  let aggr_data = []

  let gears = ["Park", "Reverse", "1st Gear", "2nd Gear", "3rd Gear", "4th Gear", "5th Gear", "6th Gear"]
  gears.forEach(g => {
    aggr_data.push({"gear":g, "avgspeed":(Number(aggregate[g].sum)/Number(aggregate[g].count))})
  })
  return aggr_data

}

const updateRecord = function(reading){
  return new Promise(resolve =>{
    fs.readFile('public/data/carreadings.json', 'utf8', function updateFile(err, readings){
      if (err){
        console.log(err);
      } else {
        let readingsObj = JSON.parse(readings);
        readingsObj.readings.push(reading);
        aggr = calculateAggr(readingsObj)
        readingsObj.aggregate = aggr
        let json = JSON.stringify(readingsObj);
        fs.writeFile('public/data/carreadings.json', json, 'utf8', function writeCallback(err){
          if (err){
            console.log(err);
          }
        });
        resolve(readingsObj);
      }
    });
  })
}

