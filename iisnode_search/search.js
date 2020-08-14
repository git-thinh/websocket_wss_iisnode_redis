//const PORT = process.env.PORT;
const PORT = 8081;
const _ = require('lodash');
const HTTP = require('http');
const SCHEMA = [];
const CACHE = [];

function responseWrite(data, response) {
    data = data || '';
    if (typeof data == 'object') data = JSON.stringify(data);
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.write(data, 'utf-8');
    response.end();
}

function add(item, response) {
    const o = item.Item;
    o['___id'] = item.Id;
    o['___schema'] = item.Schema;
    CACHE.push(o);
    var notExist = _.findIndex(SCHEMA, function (x) { return x == item.Schema; }) == -1;
    if (notExist) SCHEMA.push(item.Schema);
    responseWrite({ Ok: true, Action: 'ADD', Id: item.Id, Schema: item.Schema }, response);
}

function update(item, response) {
    const o = item.Item;
    o['___id'] = item.Id;
    o['___schema'] = item.Schema;
    CACHE.push(o);
    var index = _.findIndex(CACHE, function (x) { return x.Id == item.Id && x.Schema == item.Schema; });
    if (index != -1) CACHE[index] = o;
    responseWrite({ Ok: (index != -1), Action: 'UPDATE', Id: item.Id, Schema: item.Schema }, response);
}

function remove(item, response) {
    var index = _.findIndex(CACHE, function (x) { return x.Id == item.Id && x.Schema == item.Schema; });
    //if (index != -1) CACHE.splice(index, 1);
    if (index != -1) CACHE[index] = null;
    responseWrite({ Ok: (index != -1), Action: 'UPDATE', Id: item.Id, Schema: item.Schema }, response);
}

function search(item, response) {
    let o = { Ok: true, Data: [], Request: item, Total: 0 };
    try {
        let condition = 'o != null && o.___schema == "' + item.Schema + '" && (\r\n' + item.Item.Conditions + '\r\n)';
        const f = new Function('o', 'return ' + condition);
        const arr = _.filter(CACHE, f);
        o.Total = arr.length;
        o.Data = arr;
    } catch (e) {
        o.Ok = false;
        o.Message = 'Error:' + e.message + '. Format search must be: {Schema:"..", Conditions:" o.Id == 123 && o.Name ... "}';
    }
    responseWrite(o, response);
}

function listData(item, response) { responseWrite(CACHE, response); }
function listSchema(item, response) { responseWrite(SCHEMA, response); }

function writeFile(item, response) {
    let text = '';
    responseWrite(text, response);
}

HTTP.createServer(function (request, response) {
    const { headers, method, url } = request;
    //headers['token'] to valid

    if (method != 'POST' && url != '/add' && url != '/update' && url != '/write-file'
        && url != '/remove' && url != '/search' && url != '/list' && url != '/schema')
        return responseWrite('', response);

    const body = [];
    request.on('error', (err) => {
        console.error('REQUEST.ERROR: ', err);
    }).on('data', (chunk) => { body.push(chunk); }).on('end', () => {
        try {
            const text = Buffer.concat(body).toString();
            const item = JSON.parse(text);
            if (url == '/add' || url == '/update' || url == '/remove') {
                if (!item.hasOwnProperty('Id') || !item.hasOwnProperty('Schema') ||
                    typeof item.Schema != 'string' || !item.hasOwnProperty('Item') || typeof item.Item != 'object')
                    return responseWrite({ Ok: false, Message: 'Data POST must be format: {Id:..., Schema: "...",Item: {...}}' }, response);
            }
            item.Schema = item.Schema.toLowerCase().trim();
            switch (url) {
                case '/add': return add(item, response);
                case '/update': return update(item, response);
                case '/remove': return remove(item, response);
                case '/search': return search(item, response);
                case '/list': return listData(item, response);
                case '/schema': return listSchema(item, response);
                case '/write-file': return writeFile(item, response);
                default: return responseWrite('', response);
            }
        } catch (e) {
            return responseWrite({ Ok: false, Message: 'Occur an error: ' + e.message }, response);
        }
    });
}).listen(PORT);