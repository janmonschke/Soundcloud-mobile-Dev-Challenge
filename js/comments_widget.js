/** The Comments Widget */
var CommentsWidget = function(_commentsUrl, _track, _player, _$player){
  this.commentsUrl = _commentsUrl;
  this.track = _track;
  this.player = _player;
  this.$player = _$player;
  _.bindAll(this);
}

/** Gets the comments */
CommentsWidget.prototype.init = function(){
  this.$player.bind("timeupdate", this.updateCurrentComment);
  $("#wave_form_comments").html("");
  
  SC.get(this.commentsUrl.replace(".json", "/comments.json"), this.__commentsReceived);
};

/* Renders the comments and binds events to them */
CommentsWidget.prototype.__commentsReceived = function(comments){
  var commentsList = $('#comments');
  commentsList.html("");
  var player = $("#the_player")[0];
  
  // render each comment
  var len = comments.length;
  var curr = null;
  for(var i = 0; i < len; i++){
    curr = comments[i];
    if(curr.timestamp > 0){
      // get the timestamp in a parsed format
      curr.time = Helper.timestampToTimestring(curr.timestamp);
      
      // add a comment bar
      var commentBar = $('<div class="wave_form_comment"></div>');
      var currPosition = (curr.timestamp / this.track.duration) * $('#wave_form').width();
      commentBar.css("left", currPosition + "px");
      $('#wave_form_comments').append(commentBar);
    }
    
    commentsList.append(Mustache.to_html(TEMPLATES.comment, curr));
  }   
  
  $(".wave_form_comment").css("opacity", 1);
  
  // seek to comment time on tap
  $('.time').each(function(index, elem){
    $(elem).tap(function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      player.currentTime = parseInt($(this).data('timestamp')) / 1000;
      return false;
    })
  });
 
};

/** Fetches the comment that has been made at the currentTime and prepends it */
CommentsWidget.prototype.updateCurrentComment = function(){
  var curr_formated_time = Helper.timestampToTimestring(this.player.currentTime*1000);
  var found_elem = $("[data-url-second='"+curr_formated_time+"']");
  var comment_list = $('#comments');
  if(found_elem.length > 0){
    comment_list.prepend(found_elem[0]);
  }
};