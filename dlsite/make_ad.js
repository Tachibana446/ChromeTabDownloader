$(() => {
  var atag = $('#work_name > a')
  var url = atag.attr('href')
  var title = atag.text().trim().replace(/\s\[.*\]\s+\|\s+DLsite\s(Maniax|Book).*/, "").replace(/【\d+%OFF】/, "").replace(/DLsite専売/, "")

  var result = getH2(title) + getAtag(url, title) + getChobit() + getAttr2()

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
  var subImgSrc = type == "maniax" || type == "home" ? "doujin" : type == "books" ? "books" : "eeerrorrrr"
  var imageSizeStr = "main"
  var imgsrc = "//img.dlsite.jp/modpub/images2/work/" + subImgSrc + "/" + resultArr2[1] +
    aboutWorkId + "/" + workId + "_img_" + imageSizeStr + ".jpg"

  var aTagFull = "<a href=\"" + href + "\" target=\"_blank\"><p>DLsite:<br><p><img itemprop=\"image\" src=\"" + imgsrc + "\" alt=\"" +
    titleWithoutSitename + "\" title=\"" + titleWithoutSitename + "\" border=\"0\" class=\"target_type\" /></a><br>"

  return aTagFull
}

// Chobitのプレーヤー埋め込みを取得
function getChobit() {
  var iframe = $('#main_inner > div.work_article.work_story > div > iframe')
  if (iframe.length) {
    var url = iframe.attr('src').replace(/\?.*$/, "")
    var style = 'style="transform: scale(0.8) translate(-74px, 0);"'
    var result = '<iframe width="740" height="215" src="' + url +
      '" frameborder="0" allowfullscreen ' +
      style + ' ></iframe><br>'

    return result
  }

  return ""
}

function getAttr2() {
  var div = $('<div></div>')
  var table = $('<table></table>')
  div.append(table)
  // サークル名
  var _a = $('span.maker_name > a')
  var _myA = $('<a target="_blank" href="' + getAdLink($(_a).attr('href')) + '">' + $(_a).text() + '</a>')
  var _myTr = $('<tr><th>サークル</th><td></td></tr>')
  $(_myTr).children('td').append(_myA)
  table.append(_myTr)
  // その他の情報
  $('#work_outline > tbody > tr').each((i, tr) => {
    var header = $(tr).children('th')
    var myTr = $('<tr><th>' + $(header).text().trim() + '</th><td></td></tr>')

    switch ($(header).text().trim()) {
      case "年齢指定":
      case "作品形式":
      case "ファイル形式":
      case "イベント":
      case "ジャンル":
        return 1;
      case "その他":
        // TODO:その他の項目は適宜編集する
        var textArr = []
        $(tr).find('a').each((j, a) => {
          switch ($(a).text().trim()) {
            case '音声あり':
              break
            case '体験版':
              textArr.push('体験版あり')
              break
            default:
              textArr.push($(a).text().trim())
              break
          }
        })
        if (textArr.length == 0) break
        $(myTr).children('td').append(textArr.join('・'))
        table.append(myTr)
        break;

      default:
        var data = $(tr).children('td')
        var debug = data.text()
        if ($(data).children('a').length) {
          //if ($(data).children('a').length == 1) {

          //} else {
          // Aの数だけループ
          $(data).children('a').each((j, a) => {
            var url = $(a).attr('href').replace(/\?.*$/, "")
            if (url.charAt(0) == '/') url = "http://www.dlsite.com" + url
            var myA = $('<a target="_blank"></a>')
            $(myA).attr('href', getAdLink(url))
            $(myA).text($(a).text())
            if (j != 0) $(myTr).children('td').append(' / ')
            $(myTr).children('td').append(myA)
          })
          table.append(myTr)
          //}
        } else {
          // Aがない時
          myTr.children('td').text($(data).text())
          table.append(myTr)
        }
    }
  })
  return '\n' + $(table).prop('outerHTML') + '<br>\n'
}

function getAdLink(url) {
  var aid = "namekatei"
  // サークルプロフィールページの時
  if (/https?:\/\/www.dlsite.com\/.*?\/circle\/profile\/=\/maker_id\/.*/.test(url)) {
    var linkUrl = url.replace(/\?.*$/, "")
    var joint = linkUrl.slice(-1) == '/' ? '' : '/'
    linkUrl += joint + '?medium=bnlink&source=user&program=text&utm_medium=banner&utm_campaign=bnlink&utm_content=text'
    linkUrl = encodeURIComponent(linkUrl)

    var result = 'http://www.dlsite.com/home/dlaf/=/aid/' + aid + '/url/' + linkUrl
    return result;
  } else if (/(.*)work\/.*product_id\/(.*)/.test(url)) {
    // 作品ページの時
    var reg = /(.*)work\/.*product_id\/(.*)/;
    var arr = reg.exec(url);
    var top = arr[1];
    var id = arr[2];
    var newUrl = top + "dlaf/=/link/work/aid/" + aid + "/id/" + id;

    var result = newUrl;
    return result
  } else if (/https?:\/\/www.dlsite.com\/.+/.test(url)) {
    // 最悪どのページでもリンク貼れるのでは？
    var linkUrl = url.replace(/\?.*$/, "")
    var joint = linkUrl.slice(-1) == '/' ? '' : '/'
    linkUrl += joint + '?medium=bnlink&source=user&program=text&utm_medium=banner&utm_campaign=bnlink&utm_content=text'
    linkUrl = encodeURIComponent(linkUrl)

    var result = 'http://www.dlsite.com/home/dlaf/=/aid/' + aid + '/url/' + linkUrl
    return result
  }

}

// 声優などの情報
function getAttr() {
  var result = "\n"
  var circle = $('#work_maker > tbody > tr > td > span > a')
  if (circle.length)
    result += "サークル：" + circle.text() + "\n"
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
          case "出版社名":
            result += "<br>\n出版社:" + description
            break;
          case "著者":
            result += "<br>\n著者:" + description
            break;
          case "レーベル":
            result += "<br>\nレーベル:" + description
            break;

          default:

        }
      }
    })
  }

  return '<br><p>' + result + '</p><br>'
}
