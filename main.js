var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html'); //기본 보안처리

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/'){
        if(queryData.id === undefined){ 
            fs.readdir('./data', function(error, menu_tree){           
                var title = 'Welcome';
                var description = 'Hello, Node.js study';
                var nav = template.List(menu_tree);
                var html = template.HTML(title, nav, `<h2>${title}</h2>${description}`,
                `<ul><li class="btn_li"><a href="/create" class="btn">작성</a></li></ul>`,'');
                response.writeHead(200);
                response.end(html); 
            });
        } else {
            fs.readdir('./data', function(error, menu_tree){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var sanitizeTitle = sanitizeHtml(title);
                    var sanitizeDescription = sanitizeHtml(description);
                    var nav = template.List(menu_tree);
                    var html = template.HTML(title, nav, `<h2>${title}</h2>${sanitizeDescription}`,
                    `<ul>
                        <li class="btn_li">
                            <a href="/create" class="btn">작성</a>
                            <a href="/update?id=${sanitizeTitle}" class="btn">수정</a>
                            <form action="/delete_process" method="post">
                                <input type="hidden" name="id" value="${sanitizeTitle}">
                                <input type="submit" value="삭제">
                            </form>
                        </li>
                    </ul>`,'');
                    response.writeHead(200);
                    response.end(html); 
                });
            });
        }        
    } else if(pathname === '/create'){
        fs.readdir('./data', function(error, menu_tree){           
            var title = 'create';
            var nav = template.List(menu_tree);
            var html = template.HTML(title, nav, `                
                <h2>${title}</h2>
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="제목을 작성하세요"></p>
                    <p><textarea name="description" placeholder="이곳에 내용을 넣으세요."></textarea></p>
                    <p><input type="submit" value="등록"></p>
                </form>
            `,'');
            response.writeHead(200);
            response.end(html); 
        });
    } else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);            
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end(); 
            })
        });
    } else if(pathname === '/update'){
        fs.readdir('./data', function(error, menu_tree){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                var title = queryData.id;
                var nav = template.List(menu_tree);
                var html = template.HTML(title, nav, `
                <h2>${title}</h2>
                <form action="/update_process" method="post">
                    <input type="hidden" name="id"  value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit" value="등록"></p>
                </form>`,
                `<ul><li class="btn_li"><a href="/create" class="btn">작성</a> <a href="/update?id=${title}" class="btn">수정</a></li></ul>`);
                response.writeHead(200);
                response.end(html); 
            });
        });
    } else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error){
              fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
              })
            });
        });
    } else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(error){
              response.writeHead(302, {Location: `/`});
              response.end();
            })
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);