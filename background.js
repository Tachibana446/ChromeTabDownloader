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

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        switch (request.type) {
            case "visit":
                chrome.tabs.getSelected(null, function(tab) {
                    var url = tab.url;
                    chrome.storage.local.get("visits", function(value) {
                        var visits = value.visits;
                        // DEBUG
                        console.log("visits load");
                        console.table(visits);

                        if (visits && Object.keys(visits).length != 0 && visits.indexOf(url) != -1) {
                            console.log("true");
                            callback("visited");
                        } else {
                            callback("non visited");
                        }
                    });
                });
                return true;
                break;
            case "mainPicture":
                chrome.tabs.create({
                    url: request.url
                }, null);
                break;
            case "showPicture":
                chrome.tabs.create({
                    url: request.url,
                    active: false
                }, null);
                break;
            case "move":
                chrome.tabs.update({
                    url: request.url
                }, null);
                break;
            // 新しいタブをバックグラウンドで開く
            case "create":
                chrome.tabs.create({
                    url: request.url,
                    active: false
                });
                break;
            // 現在のタブを閉じる
            case "close":
                chrome.tabs.getSelected(selected => {
                    chrome.tabs.remove(selected.id)
                })
                break;
            // 開いてるタブを返す
            case "getTab":
              if(sender.tab){
                callback(sender.tab) // senderにタブ情報があればそれを返す
              }else{
                // なければアクティブなタブを返す
                chrome.tabs.query({
                  active: true,
                  currentWindow: true
                },(tabs) => {
                  callback(tabs[0])
                })
              }
              return true;
              break;
            default:

        }
    }
);
