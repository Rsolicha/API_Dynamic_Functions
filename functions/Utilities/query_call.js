const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * @function QueryAdd function that add information in the firebase database
 * @param {String} reference direction to insert the data
 * @param {String} document id where put the information
 * @param {JSON} informationJSON json with the info that im going to save
 * @returns {Boolean} verify if the insert was satisfactory
 */
async function QueryAdd(reference, document, informationJSON) {
    try {
        var db = admin.firestore();
        let ref = db.collection(reference).doc(document);
        await ref.set(informationJSON);
        return true;
    } catch (error) {
        return 2;
    }
}

/**
 * @function QueryUpdate function that update information in the firebase database
 * @param {String} reference direction to update the data
 * @param {String} document id where put the information
 * @param {JSON} informationJSON json with the info that im going to save
 * @returns {Boolean} verify if the update was satisfactory
 */
async function QueryUpdate(reference, document, informationJSON) {
    try {
        var db = admin.firestore();
        await db.collection(reference).doc(document).update(informationJSON);
        return true;
    } catch (error) {
        return 2;
    }
}

/**
 * @function QueryUpdate function that delete document in the firebase database
 * @param {String} reference direction to delete the data
 * @param {String} document id where put the information
 * @returns {Boolean} verify if the delete was satisfactory
 */
async function QueryDeleteDocument(reference, document) {
    try {
        var db = admin.firestore();
        await db.collection(reference).doc(document).delete();
        return true;
    } catch (error) {
        return 2;
    }
}

/**
 * @function QueryUpdate function that read documents with field validation in the firebase database
 * @param {String} reference direction to read the data
 * @param {String} field field to evaluate
 * @param {String} expression expression "==", "!=" ...
 * @param {String} value info that we need to validate
 * @returns {JSON} return data or null from query
 */
async function QueryRead(reference, field, expression, value) {
    var db = admin.firestore();
    let Ref = await db.collection(reference).where(field, expression, value).get()
        .then(snapshot => {
            if (snapshot.empty) {
                return null;
            }
            let list = [];
            snapshot.forEach(doc => {
                list.push({ "id": doc.id, "data": doc.data() });
            });
            return list;
        })
        .catch(err => {

            return err;
        });
    return Ref;

}

async function QueryGetDocument(reference, idDocument) {
    var db = admin.firestore();
    let Ref = await db.collection(reference).doc(idDocument).get()
        .then(snapshot => {
            if (snapshot.empty) {
                return null;
            }
            return snapshot.data()
        })
        .catch(err => {
            return err;
        });
    return Ref;
}

module.exports = {
    QueryAdd,
    QueryUpdate,
    QueryDeleteDocument,
    QueryRead,
    QueryGetDocument
}