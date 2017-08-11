$(() => {
    var src = $('#img').attr('src')
    console.log('オープン：\n' + src);
    chrome.runtime.sendMessage({
        type: 'eh_open_image',
        url: src
    })
})
