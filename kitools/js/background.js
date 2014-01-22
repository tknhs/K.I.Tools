// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45609617-1']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.storage.local.get(function(items) {
  if (items.general === undefined) {
    // インストール時
    _gaq.push(['_trackPageview']);
    chrome.storage.local.set({'general': new Array(false, true, false, false)});
    chrome.tabs.create({url:'chrome-extension://' + chrome.runtime.id + '/options.html'});
  }

  // バスデータの更新
  var date = new Date();
  var year = String(date.getFullYear());
  var month = String(Number(date.getMonth())+1);
  month = (month.length == 1) ? '0' + month : month;
  var day = String(date.getDate());
  day = (day.length == 1) ? '0' + day : day;
  var date_today = year + '/' + month + '/' + day;
  if (items.bus_checked_date != date_today || items.bus_checked_date === undefined) {
    bus_data.update_check(date_today);
  }

  // 扇が丘・やつかほの分断位置を保存
  if (localStorage['geo'] === undefined || JSON.parse(localStorage['geo']).version != '20130123') {
    localStorage['geo'] = JSON.stringify({'version': '20130123', 'lat': 36.497, 'lon': 136.582});
  }
});

// バス通知機能からの処理を受け取る
chrome.extension.onMessage.addListener(function(req, sender, callback) {
  var week_holi = req.day;
  var timetable = req.timetable;
  var time = req.time;
  time = time.split(':');
  time = Number(time[0])*60 + Number(time[1]);
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
        } else {
          var my_location = '扇が丘→八束穂';
          var my_img = '../icon/bus2.png';
        }
        var my_day = (week_holi == 6) ? '土曜' : '平日';
        var bus = timetable[my_day][my_location];
        for (var i=0; i<bus.length; i++){
          var bus_min = bus[i][1].split(':');
          var bus_time = Number(bus_min[0])*60 + Number(bus_min[1]);
          if (bus_time - time == 10) {
            // 通知
            var audio = new Audio('../sound/Crrect_answer3.mp3');
            audio.volume = 0.1;
            var notify = webkitNotifications.createNotification(
              my_img,
              my_location,
              '10分前 | 出発: ' + bus[i][1] + ' 到着: ' + bus[i][4]
            );
            audio.play();
            notify.show();
            setTimeout(function(){ notify.cancel(); }, 10*1000);
            break;
          }
        }
      },
      function (error) {}
    );
  }
});

