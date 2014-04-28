/**
 * AutoSave Form
 **/
function autoSaveForm() {
  // Log DataSaver events (before DataSaver start!)
  $(document).on('DataSaver_start DataSaver_stop DataSaver_save DataSaver_load DataSaver_remove', function(e) {
    if (e.type == 'DataSaver_save') {
      if (JSON.parse(localStorage['bus_notify'])) {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
          backgroundPage.bus_notify_checker('start');
        });
      } else {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
          backgroundPage.bus_notify_checker('stop');
        });
      }
    }
  });

  // Save data for fields with class 'save'
  $('#settings_form .save').DataSaver({ events: 'change keyup' });
  
  // Clear data after submit or reset 'example_form'
  $('#settings_form').on('submit reset', function() {
    $('#settings_form .save').DataSaver('remove');
  });
}

/**
 * ON/OFF Toggle
 **/
function onOffToggle() {
  $('input[type=checkbox]').iToggle({speed: 100});
  if (JSON.parse(localStorage['bus_notify'])) {
    $('.slider').css('left', '0px');
  }
}

/**
 * DropDown Select List
 **/
function dropDownSelect() {
  $('ul').css('padding', '0px');
  $('ul').css('margin', '0px');
  var selectedNumber = JSON.parse(localStorage['bus_building']) - 1;
  var selectedBuilding = $('option')[selectedNumber].text;
  $('span.selected')[0].innerText = selectedBuilding;
  $('li').removeClass('active');
  $('li').eq(selectedNumber).addClass('active');
}

/**
 * Fresh Slider
 **/
function freshSlider() {
  $('.notify_volume').freshslider({
    step: 0.1,
    max: 1.0,
    min: 0.0,
    value: localStorage['notify_volume'],
    onchange: function(volume) {
      var e = $.Event('keyup');
      e.keyCode = 40;
      $('input[name=notify_volume]').trigger(e);
      var num = Math.round(volume * 10) / 10
      $('input[name=notify_volume]').val(num);
    }
  });
}

/**
 * Play Notify Sound
 **/
$('#play_sound').click(function() {
  var audio = new Audio('/assets/sound/Crrect_answer3.mp3');
  audio.volume = localStorage['notify_volume'];
  audio.play();
});

$(document).ready(function() {
  autoSaveForm();
  onOffToggle();
  dropDownSelect();
  freshSlider();
});
