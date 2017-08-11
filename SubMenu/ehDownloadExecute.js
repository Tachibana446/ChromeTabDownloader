var total = 0

$(() => {

    $('#gdt > div').each((i, gdtm) => {
        var a = $(gdtm).find('a')
        if (a) {
            var href = $(a).attr('href')
            total += 1
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: 'eh_open',
                    href: href
                })
                total -= 1
            }, 1000)
        }
    })
})
