//agregar dependencias
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var uniqid = require('uniqid');

var port = 3000;
var localHost = 'localhost';

var server = http.createServer(function (request, response) {
    var parseUrl = url.parse(request.url, true);
    var path = parseUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '');

    var method = request.method;
    console.log(method);



    switch (path) {
        case 'venues':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                    break;
                case 'GET':
                    getVenues(request, response);
                    break;
                case 'POST':
                postObject(request, response, path);
                    break;
                default:
                    send404(request, response);
                    break;
            }
            break;
        case 'categories':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                    break;
                case 'POST':
                    postObject(request, response, path);
                    break;
                default:
                    send404(request, response);
                    break;
            }
            break;
        default:
            console.log('Request not porecess')
            send404(request, response);
            break;
    }



});

server.listen(port, localHost, function () {
    console.log('server is nuning');

});

function addCrossHeaders(request, response) {
    var origin = '*';

    if (request.headers['origin']) {
        origin = request.headers['origin']
    }

    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST, OPTIONS, PUT, DELETE, PATCH');

    if (request.headers['content-type']) {
        response.setHeader('Content-Type', request.headers['content-type']);
    }

    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Acces-Control-Allow-Methods, Content-Type');
}






function getVenues(request, response) {
    addCrossHeaders(request, response);

    console.log('');

    loadVenues().then(resolve).catch(reject);

    function resolve(venues) {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.write(JSON.stringify(venues));
        response.end();
    }

    function reject() {
        response.writeHead(404)
        response.end();
    }
}

function loadVenues() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), './data/data.json'), function (err, data) {
            if (err) {
                reject();
            } else {
                var venue = JSON.parse(data);
                resolve(venue);
            }
        })
    });
}


function respondToOptions(request, response) {
    addCrossHeaders(request, response);
    response.writeHead(200);
    response.end();

}

function postObject(request, response, path) {

    console.log('Path : ' + path);
    
    addCrossHeaders(request, response);
    let buffer = [];
    let object = null;
    let urlJSON = null;

    switch (path) {
        case 'venues':
        urlJSON = './data/venues.json' ;
            break;
        case 'categories':
        urlJSON = './data/categories.json';
            break;
    
        default:
            break;
    }

    request.on('data', function (chunk) {
        buffer.push(chunk);
    });

    request.on('end', function () {
        buffer = Buffer.concat(buffer).toString();
        object = JSON.parse(buffer);
        saveObject(object, urlJSON);
    });

};

function saveObject(object, urlJSON) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.resolve(process.cwd(), urlJSON), JSON.stringify(object), function (err) {
            if (err) {
                reject();
            } else {
                resolve();
            };
        });
    });
};


function send404(request, response) {
    addCrossHeaders(request, response);
    response.writeHead(404, {
        'Content-Type': 'application/json'
    });
    response.end();
}