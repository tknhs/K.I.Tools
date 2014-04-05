/**
 * AutoSave Form
 **/
function autoSaveForm() {
  // Log DataSaver events (before DataSaver start!)
  $(document).on('DataSaver_start DataSaver_stop DataSaver_save DataSaver_load DataSaver_remove', function(e) {});

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

$(document).ready(function() {
  autoSaveForm();
  onOffToggle();
  dropDownSelect();
});
