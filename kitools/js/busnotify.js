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
