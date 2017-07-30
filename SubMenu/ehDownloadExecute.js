var total = 0

$(() => {

    $('#gdt > div').each((i, gdtm) => {
        var a = $(gdtm).find('a')
        if (a) {
            var href = $(a).attr('href')
            total += 1
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: 'eh_open',
                    href: href
                })
                total -= 1
            }, 1000)
        }
    })
    // 次のページへ

    // 現在のページ数とラストのページ数
    var now = GetNowPage()
    var last = GetLastPage()
    setTimeout(() => Recursive(now, last), 1000)
})

// 全部送信し終わったら終了または次ページへ
function Recursive(now, last) {
    console.log('再帰:' + total);
    if (total <= 0) {
        if (now > last) {
            // 終了
            console.log("EH終了");
        } else {
            chrome.runtime.sendMessage({
                type: 'eh_next',
                next: (now + 1)
            })
        }
    } else {
        setTimeout(() => Recursive(now, last), 1000)
    }
}

function GetLastPage() {
    var result = 0
    $('body > div:nth-child(9) > table > tbody > tr > td').each((i, td) => {
        var a = parseInt($(td).text())
        if (a > result)
            result = a
    })
    return result
}

function GetNowPage() {
    var params = GetQueryString()
    if (params['p'])
        return parseInt(params['p'])
    return 0
}

function GetQueryString() {
    var result = {};
    if (1 < window.location.search.length) {
        // 最初の1文字 (?記号) を除いた文字列を取得する
        var query = window.location.search.substring(1);

        // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split('&');

        for (var i = 0; i < parameters.length; i++) {
            // パラメータ名とパラメータ値に分割する
            var element = parameters[i].split('=');

            var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);

            // パラメータ名をキーとして連想配列に追加する
            result[paramName] = paramValue;
        }
    }
    return result;
}
