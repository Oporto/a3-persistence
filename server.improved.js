const fs   = require( 'fs' ),
      express = require('express'),
      bodyParser = require("body-parser"),
      compression = require('compression'),
      helmet = require('helmet'),
      app = express(),
      timeout = require('connect-timeout'),
      passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy, 
      cookieParser = require('cookie-parser'),
      cors = require('cors');
      cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'datalogger',
  keys: ['508']
}));
app.use(cookieParser());
app.use(cors());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(compression({level: 1}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.referrerPolicy());
app.use(timeout('5s'));

let GOOGLE_CLIENT_ID = "706881345421-ervqhiq17j94u8ufp0r70mb9oqgqgr10.apps.googleusercontent.com";
let GOOGLE_CLIENT_SECRET = "nws_v15toArAHmLPbAEgIV71";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (token, refreshToken, profile, done) => {
    return done(null, {
        profile: profile,
        token: token
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect:'/'}),
    (req, res) => {
        req.session.token = req.user.token;
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.get('/api/user_data', function(req, res) {

  if (req.session.passport.user === undefined) {
      console.log("The user is not logged in")
      res.json({});
  } else {
      res.json({
          user: req.session.passport.user
      });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  if (request.session.token) {
    response.cookie('token', request.session.token);
    response.sendFile(__dirname + '/views/index.html');
  } else {
    response.cookie('token', '')
    response.sendFile(__dirname + '/views/login_home.html');
  }
});

app.post('/submit',
  function(request, response){
  
    let reading = request.body
    addRecord(reading).then(function(resolve){
      console.log(resolve)

      response.writeHeader( 200, { 'Content-Type': 'text/plain' })
      response.end("Ok");
    }).catch(err => console.log(err));
  }, 
  passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile'], failureRedirect: '/' }));

app.post('/update_delete',
 function(request, response){
  readings = request.body
  updateRecord(readings.readings).then(function(resolve){
    console.log(resolve)

    response.writeHeader( 200, { 'Content-Type': 'text/plain' })
    response.end("Ok");
  }).catch(err => console.log(err))},
  passport.authenticate('google',
 { failureRedirect: '/', scope: ['https://www.googleapis.com/auth/userinfo.profile']}));

app.get('/reading_data',
  function(request, response){
    readings = readingsdb.get("readings").value()
    response.json(readings)
  },
  passport.authenticate('google',
 { failureRedirect: '/', scope: ['https://www.googleapis.com/auth/userinfo.profile']})
)

app.get('/aggregate_data',
  function(request, response){
    aggr = readingsdb.get("aggregate").value()
    response.json(aggr)
  },
  passport.authenticate('google',
 { failureRedirect: '/', scope: ['https://www.googleapis.com/auth/userinfo.profile']})
)

// listen for requests
const listener = app.listen(3000, function() {
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

  data.forEach(re => {
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

const addRecord = function(reading){
  return new Promise(resolve =>{
    readingsdb.get("readings")
      .push(reading)
      .write();
    
    readings = readingsdb.get("readings")
      .value()
    aggr = calculateAggr(readings)
    readingsdb.set("aggregate",aggr).write()
    resolve(readingsdb.get("aggregate").value());
  })
}

const updateRecord = function(new_readings){
  
  return new Promise(resolve =>{
    readingsdb.set("readings",new_readings)
      .write();
    
    aggr = calculateAggr(new_readings)
    readingsdb.set("aggregate",aggr).write()
    resolve(readingsdb.get("aggregate").value());
  })
}
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const readingsdb = low(adapter)

fs.readFile('public/data/carreadings_base.json', 'utf8', function updateFile(err, readings_base){
  if (err){
    console.log(err);
  } else {
    r_base = JSON.parse(readings_base);
    readingsdb.defaults(r_base)
      .write()
  }
});

