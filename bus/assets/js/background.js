/**
 * バス通知チェッカー
 **/
function bus_notify_checker(notify_status) {
  var start_stop = notify_status;  // 'start' or 'stop'
  var notify_bool = JSON.parse(localStorage['bus_notify']);
  var bus = BusNotification;  // from 'assets/js/lib/busnotify.js'

  if (notify_bool && start_stop === 'start') {
    var check = bus.time_checker();
    if (check !== false) {
      check = bus.bus_checker(check[0], check[1]);
      if (check !== false) {
        bus.bus_notify(check[0], check[1], check[2]);
      }
    }
    timer_id = setTimeout(function(){ bus_notify_checker('start'); }, 60*1000);
  }
  if (notify_bool === false && start_stop === 'stop'){
    clearTimeout(timer_id);
  }
}

(function(){
  // 拡張機能インストール・更新
  var extension_version = JSON.stringify(chrome.app.getDetails().version);
  if (localStorage['extension_version'] === undefined) {
    // インストール時
    localStorage['extension_version'] = extension_version;
    localStorage['bus_notify'] = true;
    localStorage['bus_building'] = 1;
    localStorage['notify_volume'] = 0.1;
    chrome.tabs.create({url:'chrome-extension://' + chrome.app.getDetails().id + '/options.html'});
  } else if (localStorage['extension_version'] != extension_version){
    // 更新時
    localStorage['extension_version'] = extension_version;
  }

  // バスデータの更新チェック
  var date_today = now_date()[0];
  if (localStorage['bus_checked_date'] != date_today || localStorage['bus_checked_date'] === undefined) {
    BusData.update_check(date_today);
  }

  // 扇が丘・やつかほの分断位置を保存
  var geo_version = '20130123';
  if (localStorage['geo'] === undefined || JSON.parse(localStorage['geo']).version != geo_version) {
    localStorage['geo'] = JSON.stringify({'version': geo_version, 'lat': 36.497, 'lon': 136.582});
  }

  // バス通知起動
  bus_notify_checker('start');
})();
