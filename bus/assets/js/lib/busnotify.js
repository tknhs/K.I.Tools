/**
 *
 *  Title  : Departure time notification of the shuttle bus
 *  Author : tknhs
 *
 **/

var BusNotification = {
  bus_notify: function(week_holi, time, timetable) {
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
            var disp_location = chrome.i18n.getMessage('popupTabLocationYatsukaho');
            var my_img = 'assets/icon/bus1.png';
            var arrival_id = (localStorage['bus_building'] === undefined) ? 1 : JSON.parse(localStorage['bus_building']);
            var departure_id = 4;
          } else {
            var my_location = '扇が丘→八束穂';
            var disp_location = chrome.i18n.getMessage('popupTabLocationOhgi');
            var my_img = 'assets/icon/bus2.png';
            var arrival_id = 1;
            var departure_id = (localStorage['bus_building'] === undefined) ? 1 : JSON.parse(localStorage['bus_building']);
            departure_id = Math.abs(departure_id - 5);
          }
          var my_day = (_week_holi == 6) ? '土曜' : '平日';
          var bus = _timetable[my_day][my_location];
          for (var i=0; i<bus.length; i++){
            var bus_min = bus[i][arrival_id].split(':');
            var bus_time = Number(bus_min[0])*60 + Number(bus_min[1]);
            if (bus_time - _time == 10) {
              // 通知
              var audio = new Audio('assets/sound/Crrect_answer3.mp3');
              audio.volume = 0.1;
              var notify = webkitNotifications.createNotification(
                my_img,
                disp_location,
                chrome.i18n.getMessage('notifyAfter') + '10' + chrome.i18n.getMessage('notifyMinutes') +
                chrome.i18n.getMessage('notifyDeparture') + bus[i][arrival_id] +
                chrome.i18n.getMessage('notifyArrive') + bus[i][departure_id]
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
  },
  bus_checker: function(date_today, date_time) {
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
      return [week_holi, time, timetable];
    } else {
      return false;
    }
  },
  time_checker: function() {
    var d = now_date();
    // 前回時刻と違う
    var time = localStorage['time'];
    if (time != d[1] || time === undefined) {
      localStorage['time'] = d[1];
      return [d[0], d[1]];
    }
    return false;
  }
};
