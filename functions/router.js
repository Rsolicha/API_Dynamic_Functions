//Aqui se colocan las rutas para llamar las funciones de acuerdo al servicio
const express = require('express');
const app = express();

//Functions Module
app.use('/function', require('./Controller/function_controller'));


module.exports = app;