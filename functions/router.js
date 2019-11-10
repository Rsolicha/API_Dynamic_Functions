//Aqui se colocan las rutas para llamar las funciones de acuerdo al servicio
const express = require('express');
const app = express();

//Functions Module
app.use('/Function', require('./Controller/function_controller'));
//User Module
// app.use('/User', require('./Controller/user_controller'));

module.exports = app;