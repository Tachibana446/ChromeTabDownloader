/// アフィリエイトの結果のページのURLにタイトルをつける
$(() => {
console.log("DL aff page title load");

chrome.storage.sync.get('afpage_title',(value) =>{
  var dictionary = value.afpage_title
  if(dictionary == undefined) dictionary = {}

  $('#af_report_data > table.af_table > tbody > tr').each((i,tr) => {
    var td = $(tr).children('td:eq(0)')
    var link = $(td).text()
    var link_bare = link.replace(/\?.*$/, '') // GETパラメータを抜いたもの
    var page_title = ""
    if(dictionary[link_bare] !== undefined){
      page_title = dictionary[link_bare]
    }
    var html = '<a href="' + link + '" target="_blank">'
      + link + '</a> &nbsp; ' + page_title
    td.html(html)
  })
})

})
