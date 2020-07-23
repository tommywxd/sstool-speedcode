// Random Requirements
const randstr = require("randexp");
const rateLimit = require('express-rate-limit');

// Database shit
const Enmap = require('enmap');
const shrunkDb = new Enmap({name: 'scandata'});

// Website shit
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Regexs
let randomPIN = new randstr(/[0-9][0-9][0-9][0-9][0-9][0-9]/);

// Access key (i cba to make a proper login system, this will also hopefully drive skids away)
const thekey = 'CB72-69B3-D28B-715A-3E94-EAF2-57C3';

// Setting up express settings
app.use(cookieParser('gamer-ss-tool'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Setting up cooldowns
const pinLimiter = rateLimit({
  windowMs: 20000,
  max: 1,
  message:
    "Pin generate cooldown."
});

const setLimiter = rateLimit({
  windowMs: 10000,
  max: 1,
  message:
    "Result set cooldown."
});

// Handling requests
app.get('/', function(req, res) {
	if(!req.signedCookies['key'] == thekey || !req.signedCookies['key']) {
		res.redirect('/login');
	} else {
		res.redirect('/panel');
	}
});

app.get('/login', function(req, res) {
	if(!req.signedCookies['key'] == thekey || !req.signedCookies['key']) {
		res.render('login');
	} else {
		res.redirect('/panel');
	}
});

app.get('/panel', function(req, res) {
	if(req.signedCookies['key'] == thekey && req.signedCookies['key']) {
		res.render('panel', {database: shrunkDb});
	} else {
		res.redirect('/login');
	}
});

app.get('/isValid', function(req, res) {
	if(shrunkDb.get(req.query.pin) == 'Waiting') {
		res.send('valid');
	} else {
		res.send('invalid');
	}
});

app.post('/loginreq', function(req, res) {
	if(req.body.key == thekey) {
		res.cookie('key', req.body.key, {maxAge: 3600000, signed: true});
		res.send('valid');
	} else {
		res.send('invalid');
	}
});

app.post('/genpin', pinLimiter, function(req, res) {
	if(req.signedCookies['key'] == thekey && req.signedCookies['key']) {
		let gPin = randomPIN.gen();
		shrunkDb.set(gPin, 'Waiting');
		res.send(gPin);
		
		setTimeout(function(){
			if(shrunkDb.get(gPin) == 'Waiting') {
				shrunkDb.set(gPin, 'Expired');
			}
		}, 60000);
	} else {
		res.send('null');
	}
});

app.post('/setresults', setLimiter, function(req, res) {
	console.log(req.body.pin)
	console.log(req.body.results)
	if(req.body.pin && req.body.results && shrunkDb.get(req.body.pin) == 'Waiting') {
		shrunkDb.set(req.body.pin, req.body.results);
		res.send('ok.');
	} else {
		res.send('no.');
	}
});

app.listen(80);
console.log('Listening on port 80.');