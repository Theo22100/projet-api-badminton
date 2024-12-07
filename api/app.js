var createError = require('http-errors');
const { sequelize } = require('./orm');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
var indexRouter = require('./routes/index');
var userRoutes = require('./routes/users');
var reservationRoutes = require('./routes/reservations');
var terrainRoutes = require('./routes/terrains');
require('dotenv').config()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Enregistrement d'un middleware actif uniquement en env de dev
//Si on veut autoriser une application web à lire la réponse,
//il faut moduler la SOP avec une politique CORS plus permissive.
//Autoriser les requêtes Cross Origin (CORS Policy)
if (process.env && process.env.ENV == 'dev') {
  app.use((req, res, next) => {
    //En production, on n'autorisera pas l'accès aux autres sites web à notre API ainsi, sans aucune restriction
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
}

/**
 * Enregistrement des routes
 */
app.use('/', indexRouter);

app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);
app.use('/terrains', terrainRoutes);


/**
 * Configuration Swagger, exposition de l'OpenAPI Specification Document (OAD) générée sur la route /doc
 */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.error(err.stack);
  res.status(err.status || 500);
  res.send('Error');
});


// Synchroniser Sequelize avec la base de données
sequelize.sync().then(() => {
    console.log('Base de données synchronisée.');
});

module.exports = app;