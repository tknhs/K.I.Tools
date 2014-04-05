/**
 *
 *  Title  : Departure time notification of the shuttle bus
 *  Author : tknhs
 *
 **/

function bus_notify(week_holi, time, timetable) {
  var _week_holi = week_holi;
  var _time = time;
  var _timetable = timetable;
  _time = _time.split(':');
  _time = Number(_time[0])*60 + Number(_time[1]);
  var geo = JSON.parse(localStorage['geo']);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        // 位置情報
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        if (latitude<geo.lat && longitude<geo.lon) {
          var my_location = '八束穂→扇が丘';
          var my_img = '../icon/bus1.png';
          var arrival_id = (localStorage['bus_building'] === undefined) ? 1 : JSON.parse(localStorage['bus_building']);
          var departure_id = 4;
        } else {
          var my_location = '扇が丘→八束穂';
          var my_img = '../icon/bus2.png';
          var arrival_id = 1;
          var departure_id = (localStorage['bus_building'] === undefined) ? 1: JSON.parse(localStorage['bus_building']);
          departure_id = Math.abs(departure_id - 5);
        }
        var my_day = (_week_holi == 6) ? '土曜' : '平日';
        var bus = _timetable[my_day][my_location];
        for (var i=0; i<bus.length; i++){
          var bus_min = bus[i][arrival_id].split(':');
          var bus_time = Number(bus_min[0])*60 + Number(bus_min[1]);
          if (bus_time - _time == 10) {
            // 通知
            var audio = new Audio('../sound/Crrect_answer3.mp3');
            audio.volume = 0.1;
            var notify = webkitNotifications.createNotification(
              my_img,
              my_location,
              '10分前 | 出発: ' + bus[i][arrival_id] + ' 到着: ' + bus[i][departure_id]
            );
            audio.play();
            notify.show();
            notify.onclick = function() { notify.cancel(); }
            setTimeout(function(){ notify.cancel(); }, 10*1000);
            break;
          }
        }
      },
      function (error) {}
    );
  }
}

/**
 * 運行日程をチェックする（平日運行か土曜運行か運休か）
 **/
function bus_checker(date_today, date_time) {
  var today = date_today;
  var time = date_time;
  var servicetable = JSON.parse(localStorage['servicetable']).date;
  for (var i=0; i<servicetable.length; i++) {
    if (today == servicetable[i][0]) {
      var week_holi = servicetable[i][1];
      break;
    }
  }
  var week_holi = (week_holi === undefined) ? new Date().getDay() : week_holi;
  var timetable = JSON.parse(localStorage['timetable']);
  if (1 <= week_holi && week_holi <= 6) {
    bus_notify(week_holi, time, timetable);
  } else {
    clearTimeout(timer);
  }
}

function time_checker() {
  var d = now_date();
  // 前回時刻と違う
  var time = localStorage['time'];
  if (time != d[1] || time === undefined) {
    localStorage['time'] = d[1];
    bus_checker(d[0], d[1]);
  }
  timer = setTimeout(function(){ bus_checker(); }, 60*1000);
}

// main
time_checker();
