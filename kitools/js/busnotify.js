/**
 *
 *  Title  : Departure time notification of the shuttle bus
 *  Author : tknhs
 *
 **/

var bus_notify = {
  update: function(num) {
    /**
     * Update the Bus Schedule
     * 0: timetable, 1: servicetable
     **/
    var _num = num;
    var urls = ['http://www.kanazawa-it.ac.jp/shuttlebus/timetable.csv?',
                'http://www.kanazawa-it.ac.jp/shuttlebus/servicetable.csv?'];
    var url = urls[num] + +new Date();
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('text/plain; charset=shift_jis');
    xhr.open('GET', url, false);
    xhr.send();
    return get_data(xhr, _num);
  },
  update_check: function(date_today, date_time) {
    /**
     * Check for updates
     **/
    var time = date_time;
    chrome.storage.local.set({'time': time});
    chrome.storage.local.get(function(items) {
      var today = date_today;
      if (items.bus_checked_date === undefined) {
        // first time
        var timetable = JSON.stringify(bus_notify.update(0));
        var servicetable = JSON.stringify(bus_notify.update(1));
        chrome.storage.local.set({'timetable': timetable});
        chrome.storage.local.set({'servicetable': servicetable});
        chrome.storage.local.set({'bus_checked_date':today});
      }
      if (items.bus_checked_date < today) {
        // get the data per day
        var timetable = JSON.stringify(bus_notify.update(0));
        var servicetable = JSON.stringify(bus_notify.update(1));
        if (JSON.parse(items.timetable).version != timetable.version) {
          chrome.storage.local.set({'timetable': timetable});
        }
        if (JSON.parse(items.servicetable).version != servicetable.version) {
          chrome.storage.local.set({'servicetable': servicetable});
        }
        chrome.storage.local.set({'bus_checked_date':today});
      }
    });
  },
  notification: function(date_today, date_time) {
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
}

function get_data(xhr, req_num) {
  var _xhr = xhr;
  var _num = req_num;
  if (_xhr.readyState == 4 && _xhr.status == 200) {
    var str = _xhr.responseText;
    str = str.replace(/^(\n+)|(\n+)$/g, '');
    var line_split = str.split(/\n/g);
    var x_table = new Array();
    for (var i=0; i<line_split.length; i++) {
      str_split = line_split[i].split(",");
      str_split = str_split.filter(function (value, index, self) {
        return (self[index] != "" && self[index] != '\r');
      });
      x_table.push(str_split);
    }
    if (_num == 0) {
      var json = make_ttjson(x_table);
    }
    else if (_num == 1) {
      var json = make_stjson(x_table);
    }
  }
  return json;
}

function make_stjson(servicetable) {
  /**
   * make json for servicetable
   **/
  var st = servicetable;
  var st_json = new Object();
  var st_date = new Array();
  var i = 0;
  while (i<st.length) {
    if (st[i][0] == 'version') {
      st_json[st[i][0]] = st[i][1];
    }
    if (st[i][1].match(/SUNDAY|WEEKDAY/)) {
      var date_split = st[i][0].split('/');
      date_split[1] = (date_split[1].length == 1) ? '0' + date_split[1] : date_split[1];
      date_split[2] = (date_split[2].length == 1) ? '0' + date_split[2] : date_split[2];
      st[i][0] = date_split.join('/');
      st[i][1] = (st[i][1].match(/WEEKDAY/)) ? 1 : 0;
      st_date.push(st[i]);
    }
    i = i + 1;
  }
  st_json['date'] = st_date;
  return st_json;
}

function make_ttjson(timetable) {
  /**
   * make json for timetable
   **/
  var tt = timetable;
  var tt_json = new Object();
  var i = 0;
  while (i<tt.length) {
    if (tt[i][0] == 'version') {
      tt_json[tt[i][0]] = tt[i][1];
    }
    else if (tt[i][0].search(/(月曜|土曜)/) != -1) {
      var tt_date = (RegExp.$1 == '月曜') ? '平日' : '土曜';
      var tt_date_json = new Object();
      var tt_time = new Array();
      var end = 0;
      i = i + 1;
      while (end < 2) {
        if (tt[i][0] == 'end') {
          end = end + 1;
          tt_date_json[oh_ward] = tt_time;
          tt_time = new Array();
        }
        else if (tt[i][0].search(/^(土曜)?[a-zA-Z0-9]+$/) != 0) {
          if (tt[i][0] != '便名') {
            // 扇が丘→やつかほ，やつかほ→扇が丘
            var oh_ward = tt[i][0];
          }
        }
        else {
          // 時刻表
          tt_time.push(tt[i]);
        }
        i = i + 1;
      }
      end = 0;
      i = i - 1;
      tt_json[tt_date] = tt_date_json;
    }
    i = i + 1;
  }
  return tt_json;
}

function bus_checker(run_num) {
  var rn = run_num;
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
  // 初回起動時
  if (rn == 0) {
    bus_notify.update_check(date_today, date_time);
  }
  chrome.storage.local.get(function(items){
    // 前回時刻と違う
    if (date_time != items.time) {
      chrome.storage.local.set({'time': date_time});
      bus_notify.notification(date_today, date_time);
    }
    rn = rn + 1;
    timer = setTimeout(function(){ bus_checker(rn); }, 60*1000);
  });
}

// main
chrome.storage.local.get(function(items) {
  if (items.general[3] == true) {
    bus_checker(0);
  }
});

