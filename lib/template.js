module.exports = {
    HTML:function(title, nav, body , control){
        return `
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        <body>
            <h1><a href="/">WEB</a></h1>
            ${nav}
            ${control}
            ${body}
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