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
