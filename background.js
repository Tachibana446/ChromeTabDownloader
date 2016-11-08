// Author: Tachibana

// debug
console.log("load background.js");

// すべてのウィンドウの画像タブを保存
var downloadAllWindowPictures = function() {
    var options = {
        url: ["*://*/*.jpg", "*://*/*.jpeg", "*://*/*.png", "*://*/*.bmp", "*://*/*.gif", "*://*/*.JPG", "*://*/*.JPEG", "*://*/*.PNG", "*://*/*.BMP", "*://*/*.GIF"]
    };
    chrome.tabs.query(options, function(tabs) {
        for (var tab of tabs) {
            var params = {
                url: tab.url,
                conflictAction: chrome.downloads.FilenameConflictAction.uniquify
            };
            chrome.downloads.download(params, null);
        }
    });
};

// 文字列から拡張子を取得
function getExtension(url) {
    var ret;
    if (!url) return ret;
    var splits = url.split(".");
    var len = splits.length;
    if (len == 0) return url;
    ret = splits[len - 1];
    return ret;
}

// 文字列が画像拡張子かどうか判別
function checkPicture(url) {
    var exts = ["jpg", "jpeg", "png", "bmp", "gif",
        "JPG", "JPEG", "PNG", "BMP", "GIF"
    ];
    var ext = getExtension(url);
    if (exts.indexOf(ext) >= 0) {
        return true;
    } else {
        return false;
    }
}

// 現在のウィンドウの画像タブをすべて保存
var downloadPictures = function() {
    // tabsプロパティを含むオプション
    var option = {
        populate: true
    };
    chrome.windows.getCurrent(option, function(window) {
        for (var tab of window.tabs) {
            if (!checkPicture(tab.url)) continue;
            // 名前がかぶったら番号を振る
            var params = {
                url: tab.url,
                conflictAction: chrome.downloads.FilenameConflictAction.uniquify
            };
            chrome.downloads.download(params, null);
        }
    });
};
