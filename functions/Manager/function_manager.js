const QUERY = require('../Utilities/query_call');

async function createFunction(data) {
    let assign = new Date();
    let date = `${assign.getDate()}${assign.getSeconds()}${assign.getMilliseconds()}${Math.floor(Math.random() * 100000)}`;
    let response = await QUERY.QueryAdd('functions', date, data);
    return response !== 2 ? true : false
}

async function updateFunction(data, idFunction) {
    let response = await QUERY.QueryUpdate('functions', idFunction, data);
    return response !== 2 ? true : false
}

async function deleteFunction(idFunction) {
    let response = await QUERY.QueryDeleteDocument('functions', idFunction);
    return response !== 2 ? true : false
}

async function getFunctionsUser(userID) {
    let response = await QUERY.QueryRead('functions', 'user', '==', userID);
    return response;
}

async function getCodesFunction(idFunction) {
    let response = await QUERY.QueryGetDocument('functions', idFunction);
    if (response) {
        if (response.functions) {
            let associated = await verifyFunctionsAssociated(response.functions);
            return response.code + '\n' + associated;
        }
        return response.code + '\n';

    }
    return false
}

async function verifyFunctionsAssociated(functions) {
    let stringResult = "";
    await Promise.all(functions.map(async(element) => {
        stringResult = stringResult + await getCodesFunction(element);

    }));
    return stringResult;
}

async function getSearch(username, description, code, tag, function_name) {
    var list = [];
    username ? list.push(await QUERY.QueryRead('functions', 'user', '>=', username)) : false;
    description ? list.push(await QUERY.QueryRead('functions', 'description', '>=', description)) : false;
    code ? list.push(await QUERY.QueryRead('functions', 'name', '>=', code)) : false;
    tag ? list.push(await QUERY.QueryRead('functions', 'tag', '>=', tag)) : false;
    function_name ? list.push(await QUERY.QueryRead('functions', 'code', '>=', function_name)) : false;
    return await checkData(list);
}

async function checkData(list) {
    let result = list.filter((element, index, self) =>
        index === self.findIndex((aux) => (
            aux.id === element.id
        ))
    )
    return result;
}


module.exports = {
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionsUser,
    getCodesFunction,
    getSearch
}