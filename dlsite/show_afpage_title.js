/// アフィリエイトの結果のページのURLにタイトルをつける
$(() => {
  console.log("DL aff page title load");

  load_af_page_title()
  setInterval(() => load_af_page_title(), 1000)
})

function load_af_page_title() {

  var keys = [] // キーとなるURL
  var tds = [] // リンクをそのURLに置換するTD
  $('#af_report_data > table.af_table > tbody > tr').each((i, tr) => {
    var td = $(tr).children('td:eq(0)')
    // この列がすでにリンクならスキップ
    if (td.children('a')[0])
      return true
    // リンクテキストを取得
    var link = $(td).text()
    var link_bare = link.replace(/\?.*$/, '') // GETパラメータを抜いたもの
    keys.push(link_bare)
    tds.push(td)
  })
  chrome.storage.local.get(keys, (data) => {
    for (var i = 0; i < tds.length; i++) {
      var title = ""
      if (data[keys[i]] !== undefined) {
        var title = data[keys[i]].title
      }
      var html = `
        <a href="${keys[i]}" target="_blank">
          ${tds[i].text()}
        </a> &nbsp; ${title}
        `
      tds[i].html(html)
    }
  })
}
