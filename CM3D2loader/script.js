$(() => {
    $('#okButton').click(() => {
        var arr = "a,b,c,d,e,f,g,h".split(',')
        $('#frames').empty()
        // 検索文字列
        var query = $('#input').val()
        $.each(arr, (i, s) => {
            var src = 'http://ux.getuploader.com/cm3d2_' + s + '/search?q=' + query
            if(i == 0) src = 'http://ux.getuploader.com/cm3d2/search?q=' + query
            var f = $('<iframe></iframe>', {
                src: src
            })
            $('#frames').append(f)
        })
    })
})
