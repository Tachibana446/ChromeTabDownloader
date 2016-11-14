chrome.runtime.sendMessage(
    null, {
        type: "visit"
    },
    null,
    function(response) {
        console.log("response:");
        console.log(response);
        if (response == "visited") {
            $(function() {
                $("body").prepend('<div id="xVisitBar">閲覧済み</div>');
            });
        }
    }
);
