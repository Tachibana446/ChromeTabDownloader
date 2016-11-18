console.log("start getMainPicture.js");

var minWidth = 200;
var minHeight = 200;

var max = 0;
var maxSrc = "";

var option = {
    hoge: "hoge"
};

$(function() {
    $("img").each(function() {
        var img = new Image();
        img.src = $(this).attr("src");

        var width = img.width;
        var height = img.height;
        if (width < minWidth || height < minHeight)
            return true;

        if (width + height > max) {
            max = width + height;
            maxSrc = img.src;
        }
    });

    console.log(maxSrc);
    data = {
        type: "mainPicture",
        url: maxSrc
    };
    chrome.runtime.sendMessage(data, function(res) {});
});
