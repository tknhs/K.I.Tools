/**
 *
 *  Title  : Departure time notification of the shuttle bus
 *  Author : tknhs
 *
 **/

function bus_notify(date_today, date_time) {
  chrome.storage.local.get(function(items) {
    var today = date_today;
    var time = date_time;
    var servicetable = JSON.parse(items.servicetable).date;
    for (var i=0; i<servicetable.length; i++) {
      if (today == servicetable[i][0]) {
        var week_holi = servicetable[i][1];
        break;
      }
    }
    var week_holi = (week_holi === undefined) ? new Date().getDay() : week_holi;
    var timetable = JSON.parse(items.timetable);
    if (1 <= week_holi && week_holi <= 6) {
      chrome.extension.sendMessage({day: week_holi, time: time, timetable: timetable}, function(response) {});
    } else {
      clearTimeout(timer);
    }
 });
}

function now_date() {
  var date = new Date();
  var year = String(date.getFullYear());
  var month = String(Number(date.getMonth())+1);
  month = (month.length == 1) ? '0' + month : month;
  var day = String(date.getDate());
  day = (day.length == 1) ? '0' + day : day;
  var hours = String(date.getHours());
  hours = (hours.length == 1) ? '0' + hours : hours;
  var minutes = String(date.getMinutes());
  minutes = (minutes.length == 1) ? '0' + minutes : minutes;
  var date_today = year + '/' + month + '/' + day;
  var date_time = hours+':'+minutes;
  return [date_today, date_time];
}

function bus_checker() {
  chrome.storage.local.get(function(items) {
    var d = now_date();
    // 前回時刻と違う
    if (items.time != d[1] || items.time === undefined) {
      chrome.storage.local.set({'time': d[1]});
      bus_notify(d[0], d[1]);
    }
    timer = setTimeout(function(){ bus_checker(); }, 60*1000);
  });
}

// main
chrome.storage.local.get(function(items) {
  if (items.general[3] == true) {
    // 通知チェック
    bus_checker();
  }
});

