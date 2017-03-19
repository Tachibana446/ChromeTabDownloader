$(function() {
    var title = [],
        score = [],
        view = [];
    var li = $('li.image-item');
    $('li.image-item').each(function(i, li) {
        title.unshift($(li).find('h1.title').text());
        var s = $(li).find('a.score span.count').text();
        score.unshift(s);
        var v = $(li).find('a.views span.count').text();
        view.unshift(v);
    });

    // table
    var table = $('<table id="viewCountTable">');
    var tr = $('<tr>');
    for (t of title) {
        var th = $(`<th>${t}</th>`);
        tr.append(th);
    }
    table.append(tr);
    tr = $('<tr>');
    for (s of score) {
        var td = $(`<td>${s}点</td>`);
        tr.append(td);
    }
    table.append(tr);
    tr = $('<tr>');
    for (v of view) {
        var td = $(`<td>${v}</td>`);
        tr.append(td);
    }
    table.append(tr);

    $('body').prepend(table);
});
