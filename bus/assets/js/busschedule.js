/**
 *
 *  Title  : The Bus Schedule
 *  Author : tknhs
 *
 **/

window.onload = function() {
  var date = now_date();
  var today = date[0];
  var time = date[1];
  var servicetable = JSON.parse(localStorage['servicetable']).date;
  for (var i=0; i<servicetable.length; i++) {
    if (today <= servicetable[i][0]) {
      // 運行日程処理
      ins_bus_schedule(servicetable[i]);
    }
    if (today == servicetable[i][0]) {
      var week_holi = servicetable[i][1];
    }
  }
  var week_holi = (week_holi === undefined) ? new Date().getDay() : week_holi;
  if (1 <= week_holi && week_holi <= 5) {
    week_holi = 0;
  } else if (week_holi == 6) {
    week_holi = 1;
  } else {
    week_holi = 2;
  }
  ins_bus_time(JSON.parse(localStorage['timetable']), week_holi, time);
}

function ins_bus_time(tt, wh, time) {
  /*
   *  運行時刻をインサート
   */
  var _tt = tt;
  var _wh = wh;
  var _time = time;
  var schedule = ['平日', '土曜', '日曜'];
  var disp_sche = [
    chrome.i18n.getMessage('popupJSSchedule0'),
    chrome.i18n.getMessage('popupJSSchedule1'),
    chrome.i18n.getMessage('popupJSSchedule2')];
  var terminal = ['扇が丘→八束穂', '八束穂→扇が丘'];
  var terminal_time = ['o2y_time', 'y2o_time'];
  var terminal_remain_time = ['o2y_remain_time', 'y2o_remain_time'];

  // どの日程か
  var tc = document.getElementById('time_content');
  var p = document.createElement('p');
  p.setAttribute('class', 'date_schedule');
  p.innerText = disp_sche[_wh] + chrome.i18n.getMessage('add');
  tc.parentNode.insertBefore(p, tc);

  // 日曜日のときは何もしない
  if (_wh == 2) {
    for (var i=0; i<2; i+=1) {
      document.getElementById(terminal_remain_time[i]).innerText = chrome.i18n.getMessage('popupJSServiceStatus0');
    }
    return;
  }

  for (var two_way=0; two_way<2; two_way+=1) {
    /*
     * インサート処理
     * 0: 扇が丘　→やつかほ
     * 1: やつかほ→扇が丘
     */
    var building_id = (two_way === 0) ? 1 : (localStorage['bus_building'] === undefined) ? 1 : JSON.parse(localStorage['bus_building']);
    var way = _tt[schedule[_wh]][terminal[two_way]];
    var way_time = document.getElementById(terminal_time[two_way]);
    var bus_end = 0;
    for (var i=0; i<way.length; i++) {
      var bus_sm = way[i][building_id].split(':');
      bus_sm = Number(bus_sm[0])*60 + Number(bus_sm[1]);
      var now_sm = _time.split(':');
      now_sm = Number(now_sm[0])*60 + Number(now_sm[1]);
      var remain_time = bus_sm - now_sm;
      var bus_now_class = ''; // 出発が一番近いバスの時刻表に付加するクラス
      if (remain_time > 0) {
        bus_end+=1;
        if (bus_end == 1) {
          document.getElementById(terminal_remain_time[two_way]).innerText = remain_time + chrome.i18n.getMessage('popupJSRemainingTime');
          bus_now_class = 'bus_now';
        }
      } else {
        // 定刻を過ぎたバス
        remain_time = '----';
      }
      // タイムテーブル追加
      var tr = document.createElement('tr');
      tr.className = bus_now_class;
      var bus_name = document.createElement('td');
      bus_name.innerText = way[i][0];
      var bus_departure = document.createElement('td');
      bus_departure.innerText = way[i][building_id];
      var bus_remain = document.createElement('td');
      bus_remain.innerText = remain_time;
      tr.appendChild(bus_name);
      tr.appendChild(bus_departure);
      tr.appendChild(bus_remain);
      way_time.appendChild(tr);
    }
    if (bus_end == 0) {
      document.getElementById(terminal_remain_time[two_way]).innerText = chrome.i18n.getMessage('popupJSServiceStatus1');
    }
  }
}

function ins_bus_schedule(service) {
  /*
   *  運行日程をインサート
   */
  var bus_date = service[0];
  var bus_wh = service[1];
  var id_name = (bus_wh == 0) ? 'bus_sunday' : 'bus_weekday';
  var ele = document.getElementById(id_name);
  var new_ele = document.createElement('p');
  new_ele.setAttribute('class', 'bus_service');
  new_ele.innerText = bus_date;
  ele.appendChild(new_ele);
}
