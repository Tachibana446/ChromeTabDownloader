// まとめページなどのタイトルを保持しておく
chrome.storage.sync.get('afpage_title', (value) => {
  var dictionary = value.afpage_title
  if (dictionary == undefined) dictionary = {}

  chrome.runtime.sendMessage({
    type: "getTab"
  }, (tab) => {
    var url = tab.url.replace(/\?.*$/, '')
    var title = tab.title.replace(/\s+-\s+DLチャンネル\s+みんなで作る二次元情報サイト！/,'')
    dictionary[url] = title
    chrome.storage.sync.set({
      'afpage_title': dictionary
    })
  })
})
