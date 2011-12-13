/** The Player Widget */
var PlayerWidget = function(_trackUrl){
  this.trackUrl = _trackUrl;
  _.bindAll(this);
};

/** Gets the track basically */
PlayerWidget.prototype.init = function(){
  SC.get(this.trackUrl, this.__trackReceived);
};

/** Initiates the Widget */
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
  
  // start fetching the comments
  this.initComments();

  // bind to the necessary events
  this.$player.bind("ended", this.playbackEnded);
  
  this.$player.bind("progress", this.loadingProgress);
  
  this.$player.bind("timeupdate", this.updatePlayeProgress);

  this.$player.bind("canplay", this.canplay);  
  
  $("#controls button").bind("touchend", this.buttonTouched);
};

/** Initiates the player and the wave form */
PlayerWidget.prototype.canplay = function(){
  this.player.currentTime = 0; // somehow the Android browser did not fire "timeupdate" events until I set this initially
  $("#wave_form_container").tap(this.touchToSeek);
};

/** Initiates a new Comments widget */
PlayerWidget.prototype.initComments = function(){
  new CommentsWidget(this.trackUrl, this.track, this.player, this.$player).init();
};

/** Change the button on end */
PlayerWidget.prototype.playbackEnded = function(){
  $('#controls button').removeClass("pause").addClass("play")
};

/** Update the wave form loading progess */
PlayerWidget.prototype.loadingProgress = function(){
  var progress = Math.ceil((this.player.buffered.end(0) / this.player.duration) * 100);
  $('#wave_form_progress').css("width",progress+"%");
};

/** Update the wave form played progess */
PlayerWidget.prototype.updatePlayeProgress = function(){
  $('#duration').text(Helper.durationString(this.player.currentTime * 1000, this.player.duration * 1000));
  $('#wave_form_played').css("width", ((this.player.currentTime / this.player.duration)*100)+"%");
};

/** Seek to the position the user has touched */
PlayerWidget.prototype.touchToSeek = function(event){
  var relative_position = (event.touches[0].clientX - 70 ) / $("#wave_form_container").width();
  this.player.currentTime = this.player.duration * relative_position;
};

/** Play and pause the player */
PlayerWidget.prototype.buttonTouched = function(ev){
  ev.preventDefault();
  ev.stopPropagation();
  
  if(this.player.paused){
    $("#controls button").removeClass("play").addClass("pause");
    this.player.play();
  }else{
    $("#controls button").removeClass("pause").addClass("play")
    this.player.pause();
  }
  return false;
};

window.PlayerWidget = PlayerWidget;