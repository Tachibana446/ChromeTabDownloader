$(function(){
  var src =  $("div.img img").attr('src');
  var links = $("div.menu > a");

  var next = links.eq(links.length - 3).attr('href');
  next = "http://www.xtube.com" + next;
  if(links.length <= 3){
    $("body").prepend("<p>先頭か最後なので自動的に移動しませんでした</p>")
  }
  else{
    chrome.runtime.sendMessage({type:"move",url:next}, null);
  }

  var options = {
    type:"showPicture",
    url:src
  };
  chrome.runtime.sendMessage(options,null);
});
