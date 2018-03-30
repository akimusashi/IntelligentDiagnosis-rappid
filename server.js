var ws = require('nodejs-websocket');
var mysql = require('mysql');

console.log("开始建立连接...");

ws.createServer(function (request) {
    request.on('text', function (msg) {
        console.log('获得信息');
        var array = msg.split('&$&');
        var connection;
        var params;
        if (array[0] === 'add') {
            params = [array[1], array[2]];
            connection = getConnection();
            addNewModel(connection, params, request);
            connection.end();
        } else if (array[0] === 'search') {
            connection = getConnection();
            getAllModels(connection, request);
            connection.end();
        } else if (array[0] === 'selectById') {
            connection = getConnection();
            getModelById(connection, array[1], request);
            connection.end();
        } else if (array[0] === 'update') {
            params = [array[2], array[1]];
            connection = getConnection();
            updateModelById(connection, params, request);
            connection.end();
        }
    });
    request.on('close', function () {
        console.log('关闭连接');
    });
    request.on('error', function () {
        console.log('异常关闭');
    });
}).listen(8080, '127.0.0.1');

console.log("连接建立完成...");

function getConnection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'Black',
        password: '123456',
        port: '3306',
        database: 'db_test'
    });

    connection.connect();

    return connection;
}

function getAllModels(connection, request) {
    var sql = 'SELECT id,model_name FROM t_model';
    query(connection, sql, [], request, 'model_list');
}

function getModelById(connection, id, request) {
    var sql = 'SELECT * FROM t_model WHERE id = ?';
    var params = [id];
    query(connection, sql, params, request, 'model_id');
}

function getModelByName(connection, model_name, request) {
    var sql = 'SELECT * FROM t_model WHERE model_name = ?';
    var params = [model_name];
    query(connection, sql, params, request, 'model_name');
}

function addNewModel(connection, params, request) {
    var sql = 'INSERT INTO t_model (model_name, model_graph) VALUES (?, ?)';
    query(connection, sql, params, request, 'model_add');
}

function updateModelById(connection, params, request) {
    var sql = 'UPDATE t_model SET model_graph = ? WHERE id = ?';
    query(connection, sql, params, request, 'model_update');
}

function deleteModelById(connection, id, request) {
    var sql = 'DELETE FROM t_model WHERE id = ?';
    var params = [id];
    query(connection, sql, params, request, 'model_delete');
}

function query(connection, sql, params, request, type) {
    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log('[ERROR]', err.message);
            return;
        }

        request.sendText(JSON.stringify({'type': type, 'data': result}));
    });
}
