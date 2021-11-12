var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, nav, body){
    return `
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    <body>
        <h1><a href="/">WEB</a></h1>
        ${nav}
        ${body}
    </body>
    `;
}

var menu_tree = ['HTML','CSS','JavaScript']
var nav = '<ul>';
var i = 0;
while(i < menu_tree.length){
    nav = nav + `<li><a href="/?id=${menu_tree[i]}">${menu_tree[i]}</a></li>`;
    i = i + 1;
}
nav = nav + '</ul>';

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;   
    if (pathname === '/'){
        if(queryData.id === undefined){            
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var template = templateHTML(title, nav, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template); 
        } else {
            fs.readFile(`${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var template = templateHTML(title, nav, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template); 
            });
        }        
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);