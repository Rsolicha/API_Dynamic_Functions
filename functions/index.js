const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/**
 * @function config use for define the bodyparser in functions
 */
function config() {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

}
config();

/**
 * Call the router endpoints
 */
app.use(require('./router'));

app.use(express.static('client'));

/**
 * Associate express with firebase
 */
exports.app = functions.https.onRequest(app);