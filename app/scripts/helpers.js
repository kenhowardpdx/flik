'use strict';
/* global $ */
/* exported toggleWorking */

var updateThings = function() {
  $('.work-indicator').each(function() {
    var container = $(this),
        winHeight = $(window).height();

    container.height(winHeight);
  });
};

updateThings(); // On load
$(window).on('resize',updateThings); // On resize

// The work-indicator shows when the application is processing data
// and is hidden when results are displayed.
var toggleWorking = function() {
  $('.work-indicator').toggleClass('working');
};
