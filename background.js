// Author: Tachibana
chrome.browserAction.onClicked.addListener(function(currentTab) {
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
});
