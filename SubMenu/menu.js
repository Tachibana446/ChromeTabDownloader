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
    var url = _url.replace(/\?.*$/, "")
    var tab = null
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

            case 'eh_download': // DLしてタブを閉じる
                chrome.downloads.download({
                    url: request.url
                })
                if (sender.tab)
                    chrome.tabs.remove(sender.tab.id)
                break

            case 'eh_next': // 次のページへ
                if (sender.tab) {
                    var param = '?p=' + request.next
                    var url = sender.tab.url.replace(/\?.*$/, '')
                    url += param
                    chrome.tabs.update(sender.tab.id, {
                        url: url
                    }, (tab) => chrome.tabs.executeScript(tab.id, {
                        file: 'jquery.min.js'
                    }, (result) => chrome.tabs.executeScript(tab.id, {
                        file: 'SubMenu/ehDownloadExecute.js'
                    })))
                }
                break
        }
    }
)

$(() => {
    // semantic
    $('.ui.checkbox').checkbox()

    $('#eh_ok_button').click(() => ehCheckTextBox())
})
