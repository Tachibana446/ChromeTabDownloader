// URLが間違っていないかチェックする
function ehCheckTextBox() {
  var textBox = $('#eh_text')
  var regex = /https?:\/\/e-hentai.org\/.+/
  var match = $(textBox).val().match(regex)
  if (!match) {
    var message = $('<div class="ui error message"><p>URLが間違っています</p></div>')
    $('#eh_download').append($(message))
    $('#eh_field').addClass('error')
    $('#eh_field').on('keypress', () => {
      $('#eh_field').removeClass('error')
      $(message).remove()
    })
    return
  }
  ehDownload($(textBox).val())
}

// E.Hの一覧ページを開く
function ehDownload(_url) {
  var url = _url
  chrome.tabs.create({
    url: url,
    active: false
  }, (tab) => chrome.tabs.executeScript(tab.id, {
    file: './jquery.min.js'
  }, (result) => chrome.tabs.executeScript(tab.id, {
    file: 'SubMenu/ehDownloadExecute.js'
  })))

}

// EH受け取り
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    debugger;
    switch (request.type) {
      case 'eh_open':

        chrome.tabs.create({
          url: request.href,
          active: false
        }, (tab) => chrome.tabs.executeScript(tab.id, {
          file: 'jquery.min.js'
        }, (result) => chrome.tabs.executeScript(tab.id, {
          file: 'SubMenu/ehDownloadPage.js'
        })))
        break

      case 'eh_open_image': // DLしてタブを閉じる
        chrome.tabs.create({
          url: request.url,
          active: false
        })
        if (sender.tab)
          chrome.tabs.remove(sender.tab.id)
        break

    }
  }
)

// 空白で区切りリンクにしてリストにする
function makeTagLinks() {
  var output = '<ul>'
  for (tag of $('#tag_links > textarea.input').val().split('\n')) {
    output += '\n<li><a href="http://nameka-tei.blog.jp/tag/' + tag.trim() + '" >' + tag.trim() + '</a></li>'
  }
  output += '\n</ul>\n'
  $('#tag_links > textarea.output').val(output)
}

// 重複タブを削除
function removeDuplication() {
  chrome.windows.getCurrent({
    populate: true
  }, (win) => {
    var urls = []
    var ids = []
    for (var tab of win.tabs) {
      if (urls.includes(tab.url)) {
        ids.push(tab.id)
      } else {
        urls.push(tab.url)
      }
    }
    chrome.tabs.remove(ids)
  })
}

$(() => {
  // semantic
  $('.ui.checkbox').checkbox()

  $('#eh_ok_button').click(() => ehCheckTextBox())

  $('#str_count > button').click(() => $('#str_count > p').text($('#str_count>textarea').val().replace(/(\s|\n)+/g, "").length))

  $('#tag_links > button').click(() => makeTagLinks())

  $('#remove_duplication').click(() => removeDuplication())
})
