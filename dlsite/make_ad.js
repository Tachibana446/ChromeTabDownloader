$(() => {
    var atag = $('#work_name > a')
    var url = atag.attr('href')
    var title = atag.text().trim().replace(/\s\[.*\]\s+\|\s+DLsite\s(Maniax|Book).*/, "").replace(/【\d+%OFF】/, "")

    var result = getH2(title) + getAtag(url, title) + getChobit() + getAttr()

    var textarea = $('<textarea class="myClicpBoard" rows="1" cols="80"></textarea>')
    $('body').prepend(textarea)
    // Copy
    textarea.text(result)
    textarea.select()
    document.execCommand("copy")
})

function getH2(title) {
    return "<h2>" + title + '</h2><br>'
}

// サムネ付きのAタグ作成
function getAtag(url, title) {
    var aid = "namekatei"

    var titleWithoutSitename = title.replace(/\s\[.*\]\s+\|\s+DLsite\s(Maniax|Book).*/, "").replace(/【\d+%OFF】/, "")
    var resultArr = /www\.dlsite\.com\/(.*?)\/work\/.*product_id\/(.*)\.html/.exec(url)
    // 売り場がmaniaxかbookかなど
    var type = resultArr[1]
    var workId = resultArr[2]
    // 画像を大まかに分けているID　作品IDを1000区切りにしたもの
    var resultArr2 = /(.*?)(\d+)/.exec(workId)
    var aboutWorkId = (Math.floor(resultArr2[2] / 1000) + 1) * 1000 + ""
    if (aboutWorkId.length < 6) aboutWorkId = ('000000' + aboutWorkId).slice(-6)

    var href = "http://www.dlsite.com/" + type + "/dlaf/=/link/work/aid/" + aid + "/id/" + workId + ".html"
    var subImgSrc = type == "maniax" ? "doujin" : type == "books" ? "books" : "eee"
    var imageSizeStr = "main"
    var imgsrc = "//img.dlsite.jp/modpub/images2/work/" + subImgSrc + "/" + resultArr2[1] +
        aboutWorkId + "/" + workId + "_img_" + imageSizeStr + ".jpg"

    var aTagFull = "<a href=\"" + href + "\" target=\"_blank\"><img itemprop=\"image\" src=\"" + imgsrc + "\" alt=\"" +
        titleWithoutSitename + "\" title=\"" + titleWithoutSitename + "\" border=\"0\" class=\"target_type\" /></a><br>"

    return aTagFull
}

// Chobitのプレーヤー埋め込みを取得
function getChobit() {
    var iframe = $('#main_inner > div.work_article.work_story > div > iframe')
    if (iframe.length) {
        var url = iframe.attr('src').replace(/\?.*$/, "")
        var result = '<iframe width="740" height="215" src="' + url + '" frameborder="0" allowfullscreen></iframe><br>'
        return result
    }

    return ""
}

// 声優などの情報
function getAttr() {
    var result = "\n"
    var circle = $('#work_maker > tbody > tr > td > span > a')
    if (circle.length)
        result += "サークル：" + circle.text()
    var table = $('table#work_outline > tbody')
    if (table.length) {
        table.children('tr').each((i, tr) => {
            var th = $(tr).children('th')
            var td = $(tr).children('td')
            if (th.length && td.length) {
                var header = th.text().trim()
                var description = td.text().trim()
                /*
                if (td.children('a').length)
                    description = td.children('a').text().trim()
                */
                switch (header) {
                    case "シナリオ":
                        result += "<br>\nシナリオ:" + description
                        break;
                    case "声優":
                        result += "<br>\nCV:" + description
                        break;
                    case "イラスト":
                        result += "<br>\nイラスト:" + description
                        break;
                    case "作家":
                        result += "<br>\nシナリオ:" + description
                        break;
                    default:

                }
            }
        })
    }

    return '<br><p>' + result + '</p><br>'
}
