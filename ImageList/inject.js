$(() => {
    console.log('nmk:myScript loaded');

    var div = $('<div class="nmk_image_list"></div>')
    var listDiv = $('<div class="list"></div>')
    var popupDiv = $('<div class="popup"><div class="prev nav">←</div><img src=""><div class="next nav">→</div></div>')
    div.append(listDiv)
    div.append(popupDiv)
    popupDiv.hide()

    var nowIndex = 0

    // 前後ボタン
    popupDiv.children('.prev').on('click', () => {
        nowIndex = nowIndex == 0 ? $('img').length - 1 : nowIndex - 1
        popupDiv.children('img').attr('src', $('img').eq(nowIndex).attr('src'))
    })
    popupDiv.children('.next').on('click', () => {
        nowIndex = nowIndex == $('img').length - 1 ? 0 : nowIndex + 1
        popupDiv.children('img').attr('src', $('img').eq(nowIndex).attr('src'))
    })

    $('img').each((i, img) => {
        // 画像サイズが小さいときはスキップ
        var image = new Image()
        image.src = $(img).attr('src')
        if ((image.width > 0 && image.width <= 100) | (image.height > 0 && image.height <= 100))
            return 1
        // 画像作成
        var html = '<img src="' + $(img).attr('src') + '" class="nmk_thumb"></img>'
        var el = $(html)
        // ポップアップ
        el.hover(() => {
            nowIndex = i
            popupDiv.children('img').attr('src', $(img).attr('src'))
            popupDiv.show()
        }, null)
        listDiv.append(el)
    })

    div.hover(null, () => popupDiv.hide())

    var closeButton = $('<button>閉じる</button>')
    $(closeButton).click(() => $('body').find('div.nmk_image_list').remove())
    div.append(closeButton)

    $('body').prepend(div)
})
