var mute_list = [
  "6341", "426484", "395518", "368380"
]

$(() => {
  var deleted_response = []

  $("#root > div.vertical-container > .main-container > .main-section.type-talk > div.section-body > div.response-items > div.response-item")
    .each((i, item) => {
      var is_target_res = false
      // 削除済みに対するレスも削除
      $(item).find('div.response-body a').each((j, anchor) => {
        var target_id = $(anchor).text().match(/\d+/)[0]
        if (deleted_response.indexOf(target_id) > -1) {
          is_target_res = true
          return false
        }
      })
      // 対象ユーザーも削除
      var username = $(item).find('a.user')
      var id = $(username).attr('href').match(/profile\/(\d+)/)[1]

      if ((!id || mute_list.indexOf(id) == -1) && !is_target_res) {
        return true
      }
      // 削除
      var message = is_target_res ? "対象へのレスなので削除" : "削除"
      $(username).text(message)
      $(item).find('div.response-body').text(message)
      var deleted_id = $(item).attr('id')
      deleted_response.push(deleted_id)
    })
})
