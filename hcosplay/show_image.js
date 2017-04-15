$(() => {
    let url = $("#display_image_detail img").attr("src")
    chrome.runtime.sendMessage({
        type: "create",
        url: url
    }, response => {
        
    });
})
