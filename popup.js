// debug
console.log("load popup.js");

function sleep(ms) {
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while (d2 < d1 + ms) {
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
            sleep(100);
            removeTabs.push(tab.id);
        }
        if (closeTab) chrome.tabs.remove(removeTabs, null);
    });
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
                    injectScript(id);
                }
            }
        });
    });
}

function makeAdLink(includeTitle) {
    chrome.tabs.getSelected(null, function(tab) {
        var aid = "namekatei";
        var url = tab.url;
        var title = tab.title;

        var reg = /(.*)work\/.*product_id\/(.*)/;
        var arr = reg.exec(url);
        var top = arr[1];
        var id = arr[2];
        var newUrl = top + "dlaf/=/link/work/aid/" + aid + "/id/" + id;

        var result = newUrl;
        if (includeTitle) result = title + "\n" + newUrl;

        var textarea = $("#clipboard");
        textarea.text(result);
        textarea.select();
        document.execCommand("copy");
    });
}

function copyTitleAndUrl(mode) {
    chrome.tabs.getSelected(null, function(tab) {
        var text = tab.title + "\n" + tab.url;
        if (mode === "url") text = tab.url;
        else if (mode === "title") text = tab.title;
        var textarea = $("#clipboard");
        textarea.text(text);
        textarea.select();
        document.execCommand("copy");
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
});
