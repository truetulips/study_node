module.exports = {
    HTML:function(title, nav, body , control){
        return `
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        <style>
        input[type="text"] {width:80%;}
        textarea[name="description"] {width:80%;height:400px;}
        input[type="submit"] {padding:5px 10px; display:inline-block;}
        ul:last-child {padding:0;}
        .btn_li {list-style:none;}
        .btn {padding:5px 10px; color: #000; font-size:14px; border: 1px rgb(118, 118, 118) solid; border-radius:3px;  display:inline-block; margin-bottom:10px; text-decoration: none; cursor: pointer; background-color: rgb(239, 239, 239);}
        .btn:hover {background-color:rgb(230, 230, 230);}
        </style>
        <body>        
            <h1><a href="/">WEB</a></h1>
            ${nav}            
            ${body}
            ${control}
        </body>
        `;
    },
    List:function(menu_tree){
        var nav = '<ul>';
        var i = 0;
        while(i < menu_tree.length){
            nav = nav + `<li><a href="/?id=${menu_tree[i]}">${menu_tree[i]}</a></li>`;
            i = i + 1;
        }
        nav = nav + '</ul>';
        return nav;
    }
}