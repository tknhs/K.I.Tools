(function inserted_calendar_data(timeout_status) {
  $('h3').text(chrome.i18n.getMessage('calendarJsSync'));
  if (localStorage['data'] !== undefined) {
    var items = JSON.parse(localStorage['data']);
    for (var i in items) {
      var ele = $('<tr>');
      ele.html('<td>' + items[i].today + '</td><td>' + items[i].title + '</td>');
      $('tbody').append(ele);
    }
  }
  timer_id = setTimeout(function(){ inserted_calendar_data('stop'); }, 10*1000);
  if (timeout_status === 'stop') {
    clearTimeout(timer_id);
    localStorage.removeItem('data');
    var sync_num = $('tr').length - 1;
    var s = (sync_num == 0) ? chrome.i18n.getMessage('calendarJsNotFound') : sync_num + chrome.i18n.getMessage('calendarJsFound');
    $('h3').text(s);
  }
})();
