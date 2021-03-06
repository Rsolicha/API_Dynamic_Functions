const QUERY = require('../Utilities/query_call');

/**
 * @function createFunction create a new function in the database and create the id of the function
 * @param {json} data all info of the function
 */
async function createFunction(data) {
    let assign = new Date();
    let date = `${assign.getDate()}${assign.getSeconds()}${assign.getMilliseconds()}${Math.floor(Math.random() * 100000)}`;
    data.keywords = await splitDescription(data.description);
    let response = await QUERY.QueryAdd('functions', date, data);
    return response !== 2 ? true : false
}

/**
 * @function splitDescription get a text and split in list of words
 * @param {String} word text to apply split
 */
async function splitDescription(word) {
    let wordNormalized = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let textlowercase = wordNormalized.toLowerCase();
    let listWords = textlowercase.split(/[^\w]/)
    let filter = [];
    listWords.map(element => element !== "" ? filter.push(element) : false)
    return filter;
}

/**
 * @function updateFunction updates function with new data
 * @param {json} data new info of the function
 * @param {string} idFunction id function to change
 */
async function updateFunction(data, idFunction) {
    data.keywords = await splitDescription(data.description);
    let response = await QUERY.QueryUpdate('functions', idFunction, data);
    return response !== 2 ? true : false
}

/**
 * @function deleteFunction deletes a function in the database
 * @param {string} idFunction id of the function to delete
 */
async function deleteFunction(idFunction) {
    let response = await QUERY.QueryDeleteDocument('functions', idFunction);
    return response !== 2 ? true : false
}

/**
 * @function getFunctionsUser gets all functions of user in the database
 * @param {string} userID the id of the user
 */
async function getFunctionsUser(userID) {
    let response = await QUERY.QueryRead('functions', 'user', '==', userID);
    await Promise.all(response.map(async(funct) => {
        if (funct.data.functions !== null) {
            let result = [];
            await Promise.all(funct.data.functions.map(async(element) => {
                let aux = await QUERY.QueryGetDocument('functions', element);
                result.push({ "id": element, "name": aux.name });

            }));
            funct.data.functions = result;
        }

    }));


    return response;
}

/**
 * @function getCodesFunction gets the code of the function and his dependencies
 * @param {string} idFunction the if of the function
 */
async function getCodesFunction(idFunction) {
    let response = await QUERY.QueryGetDocument('functions', idFunction);
    if (response) {
        if (response.functions) {
            let associated = await verifyFunctionsAssociated(response.functions, idFunction);
            return response.code + '\n' + associated;
        }
        return response.code + '\n';

    }
    return false
}


/**
 * @function verifyFunctionsAssociated verifies if function has dependencies and call them for gets all codes
 * @param {array} functions list of id functions
 */
async function verifyFunctionsAssociated(functions, idFunction) {
    let stringResult = "";
    await Promise.all(functions.map(async(element) => {
        if (element !== idFunction) {
            stringResult = stringResult + await getCodesFunction(element);
        }
    }));
    return stringResult;
}


/**
 * @function getFunctionInfo get all information of specific function
 * @param {string} idFunction id of function
 */
async function getFunctionInfo(idFunction) {
    let response = await QUERY.QueryGetDocument('functions', idFunction);
    if (response) {
        if (response.code) {
            return response;
        }
    }
    return false;
}

/**
 * @function getSearch search a function with specific params
 * @param {string} username 
 * @param {string} description 
 * @param {string} code 
 * @param {string} tag 
 * @param {string} function_name 
 */
async function getSearch(username, description, code, tag, function_name) {
    let flag = 0;
    var list = [];
    description ? list = await descriptionFilter(description) : flag++;
    username ? list.push(await QUERY.QueryRead('functions', 'user', '==', username)) : flag++;
    code ? list.push(await QUERY.QueryRead('functions', 'code', '==', code)) : flag++;
    tag ? list.push(await QUERY.QueryRead('functions', 'tag', '==', tag)) : flag++;
    function_name ? list.push(await QUERY.QueryRead('functions', 'name', '==', function_name)) : flag++;
    flag === 5 ? list.push(await QUERY.QueryCollection('functions')) : flag = 6
    return await checkData(list);

}

/**
 * @function checkData this function verify if the list has functions duplicated
 * @param {array} list 
 */
async function checkData(list) {
    let auxList = [];

    await Promise.all(list.map(async(listsearch) => {
        if (listsearch.length > 0) {
            await listsearch.forEach(element => {
                auxList.push(element);
            });
        }
    }));
    let result = [];
    if (auxList.length > 0) {
        result = auxList.filter((element, index, self) =>
            index === self.findIndex((aux) => (
                aux.id === element.id
            ))
        )
    }

    await Promise.all(result.map(async(funct) => {
        if (funct.data.functions !== null) {
            let result = [];
            await Promise.all(funct.data.functions.map(async(element) => {
                let aux = await QUERY.QueryGetDocument('functions', element);
                result.push({ "id": element, "name": aux.name });

            }));
            funct.data.functions = result;
        }

    }));

    return result;
}

/**
 * @function descriptionFilter check in database all words in text that are equal
 * @param {String} description 
 */
async function descriptionFilter(description) {
    let wordNormalized = description.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let textlowercase = wordNormalized.toLowerCase();
    let listWords = textlowercase.split(' ')
    let listResults = [];
    await Promise.all(listWords.map(async(word) => {
        listResults.push(await QUERY.QueryRead('functions', 'keywords', 'array-contains', word))

    }));
    return listResults;
}


module.exports = {
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionsUser,
    getCodesFunction,
    getSearch,
    getFunctionInfo
}