// debug
console.log("load popup.js");

function sleep(ms) {
  let d1 = new Date().getTime();
  let d2 = new Date().getTime();
  while (d2 < d1 + ms) {
    d2 = new Date().getTime();
  }
}

// 文字列から拡張子を取得
function getExtension(url) {
  let ret;
  if (!url) return ret;
  let splits = url.split(".");
  let len = splits.length;
  if (len == 0) return url;
  ret = splits[len - 1];
  return ret;
}

// 文字列が画像拡張子かどうか判別
function checkPicture(url) {
  let exts = ["jpg", "jpeg", "png", "bmp", "gif",
    "JPG", "JPEG", "PNG", "BMP", "GIF"
  ];
  let ext = getExtension(url);
  if (exts.indexOf(ext) >= 0) {
    return true;
  } else {
    return false;
  }
}

// 現在のウィンドウの画像タブをすべて保存
function downloadPictures(closeTab) {
  // tabsプロパティを含むオプション
  let option = {
    populate: true
  };
  chrome.windows.getCurrent(option, function(window) {
    let removeTabs = [];
    for (let tab of window.tabs) {
      // DEBUG
      console.table(tab);
      if (!checkPicture(tab.url.replace(/\?.*$/, '').replace(/:orig$/, ''))) {
        continue;
      }
      // 名前がかぶったら番号を振る
      let params = {
        url: tab.url,
        conflictAction: chrome.downloads.FilenameConflictAction.uniquify
      };
      if (/:orig$/.test(tab.url)) {
        let file_title = tab.url.replace(/.*\//, '').replace(/:orig$/, '')
        params.filename = file_title
      }
      // DEBUG
      console.table(params);
      chrome.downloads.download(params, null);
      sleep(100);
      removeTabs.push(tab.id);
    }
    if (closeTab) chrome.tabs.remove(removeTabs, null);
  });
}


function injectMyScript(file) {
  chrome.tabs.executeScript(null, {
    file: 'jquery.min.js'
  }, () => {
    chrome.tabs.executeScript(null, {
      file: file
    })
  })
}

function injectScript(tabId) {
  chrome.tabs.executeScript(tabId, {
      file: "jquery.min.js"
    },
    function() {
      chrome.tabs.executeScript(tabId, {
        file: "getMainPicture.js"
      }, function(result) {});
    });
}

function showMainPicture(option) {
  let o = {
    populate: true
  };
  chrome.tabs.getSelected(null, function(selectedTab) {
    let selectedIndex = selectedTab.index;
    console.log("selectedIndex:" + selectedIndex);

    chrome.windows.getCurrent(o, function(window) {
      let closeTabIds = [];
      for (let tab of window.tabs) {
        // DEBUG
        console.log("" + tab.index + ":" + tab.title);

        if ((option == "left" && tab.index <= selectedIndex) ||
          (option == "right" && tab.index >= selectedIndex)) {
          let id = tab.id;
          injectScript(id);
        }
      }
    });
  });
}

function makeAdLink(includeTitle, aid = "namekatei", tagged = false) {
  chrome.tabs.getSelected(null, function(tab) {
    let url = tab.url;
    let title = tab.title;
    let result = ''

    // サークルプロフィールページの時
    if (/https?:\/\/www.dlsite.com\/.*?\/circle\/profile\/=\/maker_id\/.*/.test(url)) {
      let linkUrl = url.replace(/\?.*$/, "")
      let joint = linkUrl.slice(-1) == '/' ? '' : '/'
      linkUrl += joint + '?medium=bnlink&source=user&program=text&utm_medium=banner&utm_campaign=bnlink&utm_content=text'
      linkUrl = encodeURIComponent(linkUrl)

      result = 'http://www.dlsite.com/home/dlaf/=/aid/' + aid + '/url/' + linkUrl
    } else if (/(.*)work\/.*product_id\/(.*)/.test(url)) {
      // 作品ページの時
      let reg = /(.*)work\/.*product_id\/(.*)/;
      let arr = reg.exec(url);
      let top = arr[1];
      let id = arr[2];
      let newUrl = top + "dlaf/=/link/work/aid/" + aid + "/id/" + id;

      result = newUrl;
    } else if (/https?:\/\/www.dlsite.com\/.+/.test(url)) {
      // 最悪どのページでもリンク貼れるのでは？
      let linkUrl = url.replace(/\?.*$/, "")
      let joint = linkUrl.slice(-1) == '/' ? '' : '/'
      linkUrl += joint + '?medium=bnlink&source=user&program=text&utm_medium=banner&utm_campaign=bnlink&utm_content=text'
      linkUrl = encodeURIComponent(linkUrl)

      result = 'http://www.dlsite.com/home/dlaf/=/aid/' + aid + '/url/' + linkUrl
    }

    if (tagged)
      result = `<a href="${result}">${title}</a>`
    else if (includeTitle)
      result = title + "\n" + result

    copyToClipboard(result)
    return result
  });
}

// クリップボードにコピー
function copyToClipboard(str) {
  let textarea = $("#clipboard");
  textarea.text(str);
  textarea.select();
  document.execCommand("copy");

}

// 画像つきAタグを作成する
function makeAdThumbLink(size = "s", aid = "namekatei") {
  chrome.tabs.getSelected(null, function(tab) {
    let url = tab.url;
    let title = tab.title;
    let titleWithoutSitename = title.replace(/\s\[.*\]\s+\|\s+DLsite\s(Maniax|Book).*/, "").replace(/【\d+%OFF】/, "")
    let resultArr = /www\.dlsite\.com\/(.*?)\/work\/.*product_id\/(.*)(\.html|\/)/.exec(url)
    // 売り場がmaniaxかbookかなど
    let type = resultArr[1]
    let workId = resultArr[2]
    // 画像を大まかに分けているID　作品IDを1000区切りにしたもの
    let resultArr2 = /(.*?)(\d+)/.exec(workId)
    let aboutWorkId = (Math.floor(resultArr2[2] / 1000) + 1) * 1000 + ""
    if (aboutWorkId.length < 6) aboutWorkId = ('000000' + aboutWorkId).slice(-6)

    let href = "http://www.dlsite.com/" + type + "/dlaf/=/link/work/aid/" + aid + "/id/" + workId + ".html"
    let subImgSrc = type == "maniax" ? "doujin" : type == "books" ? "books" : "eee"
    let imageSizeStr = size == "s" ? "mini" : size == "m" ? "sam" : "main"
    let imgsrc = "//img.dlsite.jp/modpub/images2/work/" + subImgSrc + "/" + resultArr2[1] +
      aboutWorkId + "/" + workId + "_img_" + imageSizeStr + ".jpg"

    let aTagFull = "<a href=\"" + href + "\" target=\"_blank\"><img itemprop=\"image\" src=\"" + imgsrc + "\" alt=\"" +
      titleWithoutSitename + "\" title=\"" + titleWithoutSitename + "\" border=\"0\" class=\"target_type\" /></a>"
    // Copy
    copyToClipboard(aTagFull)
  })
}

// DLsite/pixivの作品タイトルのみをコピー
function getTitleOnlyFromDlsite() {
  chrome.tabs.getSelected(null, (tab) => {
    let title = tab.title.replace(/\s\[.*\]\s+\|\s+DLsite\s(Maniax|Book|同人|電子書籍|美少女ゲーム).*/, "").replace(/【\d+%OFF】/, "")
    title = title.replace(/\/「.*?」の.*?\[pixiv\]$/, '')
    copyToClipboard(title)
  })
}

function copyTitleAndUrl(mode) {
  chrome.tabs.getSelected(null, function(tab) {
    let text = tab.title + "\n" + tab.url;
    if (mode === "url") text = tab.url;
    else if (mode === "title") text = tab.title;
    copyToClipboard(text)
  });
}

function createPixivViewTable() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {
      file: "jquery.min.js"
    }, function() {
      chrome.tabs.executeScript(tab.id, {
        file: "pixiv/execute.js"
      }, function() {
        chrome.tabs.insertCSS(tab.id, {
          file: "pixiv/table.css"
        });
      });
    });
  });
}

function separateTabs() {
  chrome.windows.create({}, function(window) {
    chrome.tabs.getSelected(function(current) {
      chrome.tabs.getAllInWindow(function(tabs) {
        let rightTabIds = [];
        let right = false;
        for (tab of tabs) {
          if (tab.id == current.id) {
            right = true;
          } else if (right) {
            rightTabIds.push(tab.id);
          }
        }
        console.log(window);
        console.log(rightTabIds);
        chrome.tabs.move(rightTabIds, {
          windowId: window.id,
          index: 0
        })
      });
    });
  });
}

// 画像リストを出す
function createImageList() {
  chrome.tabs.executeScript(null, {
    file: 'jquery.min.js'
  }, (result) => chrome.tabs.executeScript(null, {
    file: 'ImageList/inject.js'
  }, (result) => chrome.tabs.insertCSS(null, {
    file: 'ImageList/inject.css'
  }, null)))
}

$(function() {
  $("#downloadPictures").click(function() {
    downloadPictures(false);
  });
  $("#downloadPictures2").click(function() {
    console.log("click 2");
    downloadPictures(true);
  });
  $('#separateRight').click(function() {
    separateTabs();
  });
  $("#debug").click(function() {
    chrome.storage.local.set({
      key: "key"
    }, function() {
      chrome.storage.local.get("key", function(value) {
        console.table(value);
      });
    });
  });
  $("#visit").click(function() {
    chrome.storage.local.get("visits", function(data) {
      chrome.tabs.getSelected(null, function(tab) {
        if (!data || Object.keys(data).length === 0) {
          data.visits = [tab.url];
        } else if (data.visits.indexOf(tab.url) != 1) {
          data.visits.push(tab.url);
        }
        chrome.storage.local.set({
          visits: data.visits
        }, function() {});

      });
    });
  });
  $("#xtubeImg").click(function() {
    chrome.tabs.executeScript(null, {
      file: "jquery.min.js"
    }, function() {
      chrome.tabs.executeScript(null, {
        file: "xtube/showMainPicture.js"
      }, null)
    });
  });
  $("#showImgLeft").click(function() {
    showMainPicture("left");
  });
  $("#showImgRight").click(function() {
    showMainPicture("right");
  });
  $("#makeAdAndTitle").click(function() {
    makeAdLink(true);
  });
  $("#makeAd").click(function() {
    makeAdLink(false);
  });
  $('#makeAdAndTitle_tw').click(function() {
    makeAdLink(true, "nmktw")
  })
  $("#makeTitleAndUrl").click(function() {
    copyTitleAndUrl();
  });
  $("#copyTitle").click(function() {
    copyTitleAndUrl("title");
  });
  $("#copyUrl").click(function() {
    copyTitleAndUrl("url");
  });
  $('#pixivView').click(function() {
    createPixivViewTable();
  });
  $('#makeThumbS').click(() => {
    makeAdThumbLink("s")
  })
  $('#makeThumbM').click(() => {
    makeAdThumbLink("m")
  })
  $('#makeThumbL').click(() => {
    makeAdThumbLink("l")
  })
  $('#makeTitleOnly').click(() => getTitleOnlyFromDlsite())

  $('#makeAdAtag').click(() => makeAdLink(false, 'namekatei', true))

  $('#makeChobits').click(() => injectMyScript('dlsite/make_ad.js'))

  $('#otherMenu').click(() => chrome.tabs.create({
    url: "./SubMenu/index.html"
  }))
  $('#imageList').click(() => createImageList())
});
