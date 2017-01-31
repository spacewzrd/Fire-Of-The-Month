  $(function() {
      var revsPerSec = 2;
      var dragStartInfo = {
        seconds : 0,
        degrees : 0
      };
      var myDraggable = Draggable.create("#rec", {
        type:"rotation",
        throwProps:true,
        onDragStart: function(){
          dragStartInfo.seconds = song.currentTime;
          dragStartInfo.degrees = this.rotation;
        },
        onDrag: function(){
          // create scratching here
        },
        onDragEnd: function(){
          var deltaDegrees = this.rotation - dragStartInfo.degrees;
          var deltaSeconds = (deltaDegrees / 360) * revsPerSec;
          var newTime = dragStartInfo.seconds + deltaSeconds;
          if (newTime < 0)
            newTime = 0;
          if (newTime > song.duration)
            newTime = song.duration;
          console.log('change in degrees & seconds', deltaDegrees, deltaSeconds, newTime);
          song.currentTime = newTime;
          rotation(true);
          song.play();
        },
      });

      play = $('#play');
      pause = $('#pause');
      song = new Audio('GetRightWitcha.mp3');
      duration = song.duration;

      var angle = 0;
      var songtime = song.duration;
      var stop = false;
      var currentdeg = 0;
      var rotation = function (clockwise){
        $("#rec").rotate({
          angle: clockwise ? 0 : 360,
          animateTo: clockwise ?  360 : 0,
          callback: function () { rotation (clockwise) } ,
          easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
            return c*(t/d)+b;
          }
        });
      }

      play.click( function(e) {
        e.preventDefault();
        if (stop == false) {
          return;
        }
        else {
          stop = false
          rotation(true);
          song.play();
        }
      });

    pause.click( function(e) {
      e.preventDefault();
      song.pause();
      stop = true
      $("#rec").stopRotate();
      // currentdeg = $("#rec").getRotateAngle();
      // console.log(currentdeg);
    });


    $("#rec").bind('touchstart mousedown', function(e){
      e.preventDefault();
      $("#rec").stopRotate();
      song.pause();
    });
    $("#rec").bind('touchend mouseup', function(e){
        e.preventDefault();
    });

  setInterval(function() {
    var mins = Math.floor(song.currentTime / 60);
    var secs = Math.round(song.currentTime - mins * 60);
    if (secs<10) secs = '0' + secs;
    $('#currentTime').text(mins + ':' + secs);
  }, 500);


  $("#seek").bind("change", function() {
    song.currentTime = $(this).val();
    $("#seek").attr("max", song.duration);
  });

  song.addEventListener('timeupdate',function (){
  curtime = parseInt(song.currentTime, 10);
    $("#seek").attr("value", curtime);
  });

  song.autoplay = true;
  rotation(true);

});
