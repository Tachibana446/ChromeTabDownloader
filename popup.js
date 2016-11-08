// debug
console.log("load popup.js");

var BG = chrome.extension.getBackgroundPage();

$(function() {
    $("#downloadPictures").click(function() {
        BG.downloadPictures();
    });
});
