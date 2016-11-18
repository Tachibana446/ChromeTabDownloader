// debug
console.log("load popup.js");

function sleep(second) {
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while (d2 < d1 + 1000 * second) {
        d2 = new Date().getTime();
    }
}

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
function downloadPictures(closeTab) {
    // tabsプロパティを含むオプション
    var option = {
        populate: true
    };
    chrome.windows.getCurrent(option, function(window) {
        var removeTabs = [];
        for (var tab of window.tabs) {
            // DEBUG
            console.table(tab);
            if (!checkPicture(tab.url)) {
                continue;
            }
            // 名前がかぶったら番号を振る
            var params = {
                url: tab.url,
                conflictAction: chrome.downloads.FilenameConflictAction.uniquify
            };
            // DEBUG
            console.table(params);
            chrome.downloads.download(params, null);
            removeTabs.push(tab.id);
        }
        sleep(1);
        if (closeTab) chrome.tabs.remove(removeTabs, null);
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    switch (message.type) {
        case "mainPicture":
            chrome.tabs.create({
                url: message.url
            }, null);
            break;
        default:

    }
});

function showMainPicture(option) {
    var o = {
        populate: true
    };
    chrome.tabs.getSelected(null, function(selectedTab) {
        var selectedIndex = selectedTab.index;
        console.log("selectedIndex:" + selectedIndex);

        chrome.windows.getCurrent(o, function(window) {
            var closeTabIds = [];
            for (var tab of window.tabs) {
                // DEBUG
                console.log("" + tab.index + ":" + tab.title);

                if ((option == "left" && tab.index <= selectedIndex) ||
                    (option == "right" && tab.index >= selectedIndex)) {
                    var id = tab.id;
                    chrome.tabs.executeScript(id, {
                            file: "jquery.min.js"
                        },
                        function() {
                            chrome.tabs.executeScript(id, {
                                file: "getMainPicture.js"
                            }, function(result) {});
                        });
                }
            }
        });
    });
}

//var BG = chrome.extension.getBackgroundPage();

$(function() {
    $("#downloadPictures").click(function() {
        downloadPictures(false);
    });
    $("#downloadPictures2").click(function() {
        console.log("click 2");
        downloadPictures(true);
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
        chrome.storage.local.get("visits", function(visits) {
            chrome.tabs.getSelected(null, function(tab) {
                if (!visits || Object.keys(visits).length === 0) {
                    visits = [tab.url];
                } else if (visits.indexOf(tab.url) != 1) {
                    visits.push(tab.url);
                }
                chrome.storage.local.set({
                    visits: visits
                }, function() {});

                // DEBUG
                console.table(visits);
            });
        });
    });
    $("#showImgLeft").click(function() {
        showMainPicture("left");
    });
    $("#showImgRight").click(function() {
        showMainPicture("right");
    });
});
