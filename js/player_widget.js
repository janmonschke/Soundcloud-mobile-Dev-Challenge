var PlayerWidget = function(_trackUrl){
  this.trackUrl = _trackUrl;
  this.hacked = false;
  _.bindAll(this);
};

PlayerWidget.prototype.init = function(){
  SC.get(this.trackUrl, this.__trackReceived);
};

PlayerWidget.prototype.__trackReceived = function(track){
  this.track = track;
  
  // prepare data for rendering
  if(!track.artwork_url) track.artwork_url = "http://placehold.it/100/666/fff.png&text=No Cover Art"
  track.duration_string = Helper.durationString(0, this.track.duration);
  
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

  this.$player.bind("canplay", this.canplay);  
  
  $("#controls button").bind("touchend", this.buttonTouched);
};

PlayerWidget.prototype.canplay = function(){
  $("#wave_form_container").bind("touchstart", this.touchToSeek);
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
  $('#duration').text(Helper.durationString(this.player.currentTime * 1000, this.player.duration * 1000));
  $('#wave_form_played').css("width", ((this.player.currentTime / this.player.duration)*100)+"%");
};

PlayerWidget.prototype.touchToSeek = function(event){
  if(!this.hacked) {this.hacked = true; this.player.currentTime = 0; return null;}
  var relative_position = (event.touches[0].clientX - 70 ) / $("#wave_form_container").width();
  this.player.currentTime = this.player.duration * relative_position;
};

PlayerWidget.prototype.buttonTouched = function(){
  if(this.player.paused){
    if(!this.hacked){
      var fireOnThis = document.getElementById('wave_form_container');
      var evObj = document.createEvent('MouseEvents');
      evObj.initMouseEvent( 'click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
      fireOnThis.dispatchEvent(evObj);
    }
    $("#controls button").removeClass("play").addClass("pause");
    this.player.play();
  }else{
    $("#controls button").removeClass("pause").addClass("play")
    this.player.pause();
  }
  return false;
};

window.PlayerWidget = PlayerWidget;