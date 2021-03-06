var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();

// Passport configurators...
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);


/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash = require('express-flash');

// attempt to build the providers/passport config
var config = {};
try {
	config = require('../providers.json');
} catch (err) {
	console.trace(err);
	process.exit(1); // fatal
}

// boot scripts mount components like REST API
boot(app, __dirname, function(err) {
	if (err) throw err;
 });

// -- Add your pre-processing middleware here --

// BODY PARSER
// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
	extended: true
}));

// ACCESS TOKEN
// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me'
}));

// COOKIE PARSER
app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
app.middleware('session', loopback.session({
	secret: 'kitty',
	saveUninitialized: true,
	resave: true
}));

// FLASH PASSPORT ERROR MESSAGES
app.use(flash());

// PASSPORT CONFIGURATORS
passportConfigurator.init();
	passportConfigurator.setupModels({
		userModel : app.models.AppUser,
		userIdentityModel : app.models.userIdentity,
		userCredentialModel : app.models.userCredential
	});

for (var s in config) {
	var c = config[s];
	c.session = c.session !== false;
	passportConfigurator.configureProvider(s, c);
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

  // start the server if `$ node server.js`
if (require.main === module){
	app.start();
}
