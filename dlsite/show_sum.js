$(() => {
    var click_sum = 0
    var sell_sum = 0
    var result_sum = 0
    var sum = [0, 0, 0]
    $('.report_detail > .af_table > tbody > tr').each((i, elem) => {
        var nums = $(elem).find('td > div > strong')
        $(nums).each((j, strong) => {
            if (!isNaN($(strong).text())) {
                sum[j] += parseInt($(strong).text(), 10)
            }
        })
    })

    $('.report_detail > .af_table > tbody').append($(`<tr><td>合計</td><td><strong>${sum[0]}</strong></td><td><strong>${sum[1]}</strong></td><td><strong>${sum[2]}</strong></td></tr>`))
})
