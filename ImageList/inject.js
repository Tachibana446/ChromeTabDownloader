$(() => {
    console.log('nmk:myScript loaded');

    var div = $('<div class="nmk_image_list"></div>')
    var listDiv = $('<div class="list"></div>')
    div.append(listDiv)
    var popupDiv = $('<div class="popup_bg"><div class="popup"><img src=""></div></div>')
    popupDiv.click(() => popupDiv.hide())
    div.append(popupDiv)
    popupDiv.hide()

    div.prepend($('<h2>' + $('img').length + '</h2>'))

    $('img').each((i, img) => {
        // 画像サイズが小さいときはスキップ
        var image = new Image()
        image.src = $(img).attr('src')
        if (image.width <= 100 | image.height <= 100)
            return 1
        // 画像作成
        var html = '<img src="' + $(img).attr('src') + '" class="nmk_thumb"></img>'
        var el = $(html)
        // ポップアップ
        el.click(() => {
            popupDiv.find('img').attr('src', $(img).attr('src'))
            popupDiv.show()
        })
        listDiv.append(el)
    })

    var closeButton = $('<button>閉じる</button>')
    $(closeButton).click(() => $('body').find('div.nmk_image_list').remove())
    div.append(closeButton)

    $('body').prepend(div)
})
