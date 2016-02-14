'use strict';
$(function () {
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var $videoHandler = $('.handler');
  var $video = $('<video muted autoplay ></video>');
  var $videoContainer = $('.videoContainer');
  var $rotateButton = $('.rotateButton');

  // init stuff
  $('#clock').fitText(0.3);
  setRotateVideoBtnListener();

  function gotSources(sourceInfos) {
    for (var i = 0; i !== sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'video') {
        startVideo(sourceInfo.id);
      }
    }
  }

  if (typeof MediaStreamTrack === 'undefined' ||
      typeof MediaStreamTrack.getSources === 'undefined') {
    alert('Sorry, this browser does not support MediaStreamTrack.');
  } else {
    MediaStreamTrack.getSources(gotSources);
  }

  function successCallback(stream) {
    window.stream = stream; // make stream available to console
    var $videoHandlerInstance = $videoHandler.clone().show();
    var $videoInstance = $video.clone();
    $videoContainer.append($videoHandlerInstance.append($videoInstance));

    $videoInstance.attr('src', window.URL.createObjectURL(stream));
    $videoInstance[0].play();

    initDragResize();

  }

  function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  function startVideo(videoSource) {
    var constraints = {
      video: {
        optional: [{
          sourceId: videoSource
        }]
      }
    };
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }

  function initDragResize() {
      $('.draggable').each(function() {
        $(this).draggable({
          stack: '.handler'
        });
      });
      $('.resizable').each(function() {
        $(this).resizable({
          handles: 'all',
          aspectRatio: true,
          autoHide: true
        });
      });
  }


  function setRotateVideoBtnListener() {
    $videoContainer.on('click', '.rotateButton', function (e) {
      e.preventDefault();

      $videoHandler = $(this).closest('.handler');
      var currentRotation = $videoHandler.data('rotation') || 0;
      var newRotation = currentRotation + 90;
      $videoHandler.animateRotate(newRotation, 0);
      $videoHandler.data('rotation', newRotation);
      initDragResize();

      return false;
    });
  }

});

$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};
