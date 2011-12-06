/** All needed templates */
window.addEventListener("load",function(){
  window.TEMPLATES = {
    player : $("#tmpl_player").html(),
    comment : $("#tmpl_comment").html()
  };

  window.Helper = {
    /** converts a SC-timestamp to the MM:SS format */
    timestampToTimestring : function(timestamp){
      var minutes = Math.floor((timestamp / 1000) / 60) + ""
      if(minutes.length < 2) minutes = "0" + minutes;
      var seconds = Math.floor((timestamp / 1000) % 60) + "";
      if(seconds.length < 2) seconds = "0" + seconds;
      return minutes + ":" + seconds;
    }
  };
});

window.addEventListener("load", function(){
  $("#select_track").bind("change",function(ev){
    new PlayerWidget($(this).val()).init();
  });
  
  new PlayerWidget($("#select_track").val()).init();
});