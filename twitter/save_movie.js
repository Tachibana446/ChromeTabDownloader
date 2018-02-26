// ERR_NAME_NOT_RESOLVED
$(() => {
  console.log("debug:save_movie")
  let button = $(`
    <div>
      <button>保存</button>
    </div>
    `)
  button.on('click', () => {
    chrome.tabs.getCurrent(tab => {
      let sid = tab.url.replace(/.*\//, '')
      var settings = {
        crossDomain: true,
        header: {
          Authorization: 'Bearer 	198817461-u8GWZEBr1i1zohnENCP2Eor9HdUrUDrGn8VYGHAr'
        },
        url: `https://api.twitter.com/1.1/statuses/show.json?include_entities=true&id=${sid}`,
        method: 'GET',
      }
      $.ajax(settings)
        .done((data, text_status, jqXHR) => {
          debugger;
          for (let media of data.extended_entities.media) {
            var maxsize = 0
            var url = ""
            for (let variant of media.video_info.variants) {
              if (/video/.test(variant.content_type)) {
                if (parseInt(variant.bitrate) > maxsize) {
                  maxsize = parseInt(variant.bitrate)
                  url = variant.url
                }
              }
            }
            chrome.downloads.download({
              url: url,
              conflictAction: chrome.downloads.FilenameConflictAction.uniquify,
            })
          }
        })
    })
  })
  $('#permalink-overlay-body > div.ProfileTweet-actionCountList').append(button)
})
