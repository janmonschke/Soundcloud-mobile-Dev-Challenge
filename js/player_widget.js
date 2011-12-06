var PlayerWidget = function(_trackUrl){
  this.trackUrl = _trackUrl;
  _.bindAll(this);
};

PlayerWidget.prototype.init = function(){
  SC.get(this.trackUrl, this.__trackReceived);
};

PlayerWidget.prototype.__trackReceived = function(track){
  this.track = track;
  // prepare data for rendering
  if(!track.artwork_url) track.artwork_url = "http://placehold.it/100/666/fff.png&text=No Cover Art"
  
  // remove old player if present
  $("#the_player").remove();
  
  // render the new player
  var player_html = Mustache.to_html(TEMPLATES.player, track);
  $("#player_container").html(player_html);
  
  this.player = $("#the_player")[0];
  this.$player = $(this.player);
  
  this.initComments();

  this.$player.bind("ended", this.playbackEnded);
  
  this.$player.bind("progress", this.loadingProgress);
  
  this.$player.bind("timeupdate", this.updatePlayeProgress);
  
  var that = this;
  this.$player.bind("canplay", function(){
    $("#wave_form_container").bind("touchstart", that.touchToSeek);
  });
  
  
  $("#controls button").bind("touchstart", this.buttonTouched);
  
};

PlayerWidget.prototype.initComments = function(){
  new CommentsWidget(this.trackUrl, this.track, this.player, this.$player).init();
};

PlayerWidget.prototype.playbackEnded = function(){
  $('#controls button').removeClass("pause").addClass("play")
};

PlayerWidget.prototype.loadingProgress = function(){
  var progress = Math.ceil((this.player.buffered.end(0) / this.player.duration) * 100);
  $('#wave_form_progress').css("width",progress+"%");
};

PlayerWidget.prototype.updatePlayeProgress = function(){
  $('#wave_form_played').css("width", ((this.player.currentTime / this.player.duration)*100)+"%");
};

PlayerWidget.prototype.touchToSeek = function(event){
  var relative_position = (event.touches[0].clientX - 70 ) / $("#wave_form_container").width();
  this.player.currentTime = this.player.duration * relative_position;
};

PlayerWidget.prototype.buttonTouched = function(){
  if(this.player.paused){
    $("#controls button").removeClass("play").addClass("pause");
    this.player.play();
  }else{
    $("#controls button").removeClass("pause").addClass("play")
    this.player.pause();
  }
};

window.PlayerWidget = PlayerWidget;