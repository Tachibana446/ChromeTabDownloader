$(() => {
    // ページ選択ボタンを上にも追加
    $('div.page-links.cf').eq(0).clone().appendTo('header.article-header.entry-header')
})
