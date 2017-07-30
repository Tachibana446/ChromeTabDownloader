$(() => {
    var src = $('#img').attr('src')
    console.log('ダウンロード：\n' + src);
    chrome.runtime.sendMessage({
        type: 'eh_download',
        url: src
    })
})
