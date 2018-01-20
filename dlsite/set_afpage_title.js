// 筆者のページでなければスキップ
$(() => {
  var author = $('#root > div.matome-canopy > div.canopy-header > div.canopy-info > dl > dd.element-author > a')
  if (!(/\/9034\/?/.test(author.attr('href')))) {
    return
  }

  // まとめページなどのタイトルを保持しておく
  chrome.runtime.sendMessage({
    type: "getTab"
  }, (tab) => {
    var url = tab.url.replace(/\?.*$/, '')
    var title = tab.title.replace(/\s+-\s+DLチャンネル\s+みんなで作る二次元情報サイト！/, '')

    chrome.storage.local.get(url, (data) => {
      if (data[url] != title) {
        var new_data = {}
        new_data[url] = {
          'title': title
        }
        chrome.storage.local.set(new_data)
      }
    })
  })

})
