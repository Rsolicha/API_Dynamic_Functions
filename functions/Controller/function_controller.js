const FUNCTION_MANAGER = require('../Manager/function_manager');
const express = require('express');
const HttpStatus = require('http-status-codes');
const router = express.Router();
const app = express();
/**
 * Add a new function to the database
 */
app.put('/Add', async(req, res) => {
    let result = await FUNCTION_MANAGER.createFunction({
        "user": req.body.user,
        "code": req.body.code,
        "tag": req.body.tag,
        "name": req.body.name,
        "description": req.body.description,
        "functions": req.body.functions !== undefined ? req.body.functions : null
    });
    return result ?
        res.status(HttpStatus.OK).send({ "data": "Agregado" }) :
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "data": "No Agregado" });
});

/**
 * Update a function in the database
 */
app.post('/Update', async(req, res) => {
    let result = await FUNCTION_MANAGER.updateFunction({
        "user": req.body.user,
        "code": req.body.code,
        "tag": req.body.tag,
        "name": req.body.name,
        "description": req.body.description,
        "functions": req.body.functions !== undefined ? req.body.functions : null
    }, req.body.idFunction);
    return result ?
        res.status(HttpStatus.OK).send({ "data": "Actualizado" }) :
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "data": "No Actualizado" });
});

/**
 * Update a function in the database
 */
app.delete('/Delete', async(req, res) => {
    let result = await FUNCTION_MANAGER.deleteFunction(req.query.idFunction);
    return result ?
        res.status(HttpStatus.OK).send({ "data": "Eliminado" }) :
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "data": "No Eliminado" });

});

/**
 * Get a function from user
 */
app.get('/Get', async(req, res) => {
    var result = await FUNCTION_MANAGER.getFunctionsUser(req.query.user);
    res.status(HttpStatus.OK).send({ "data": result });

});

/**
 * Get a code of specific function with code of associated functions
 */
app.get('/Code', async(req, res) => {
    let result = await FUNCTION_MANAGER.getCodesFunction(req.query.idFunction);
    if (result) {
        res.setHeader('content-type', 'text/javascript');
        res.status(HttpStatus.OK).send(result);
    } else {
        res.setHeader('content-type', 'text/javascript');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('console.log("Error al obtener datos);');
    }
});

/**
 * Search function with specific type (Username, Description, Code, Tag, Name Function)
 */
app.get('/Search', async(req, res) => {

    let result = await FUNCTION_MANAGER.getSearch(
        req.query.username !== undefined ? req.query.username : false,
        req.query.description !== undefined ? req.query.description : false,
        req.query.code !== undefined ? req.query.code : false,
        req.query.tag !== undefined ? req.query.tag : false,
        req.query.function_name !== undefined ? req.query.function_name : false,
    );
    res.status(HttpStatus.OK).send({ "data": result });
});

module.exports = app;