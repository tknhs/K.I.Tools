/**
 *
 *  Title  : The shuttle bus data
 *  Author : tknhs
 *
 **/

var BusData = {
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
  update_check: function(date_today) {
    /**
     * Check for updates
     **/
    var today = date_today;
    if (localStorage['bus_checked_date'] === undefined) {
      // first time
      var timetable = JSON.stringify(this.update(0));
      var servicetable = JSON.stringify(this.update(1));
      localStorage['timetable'] = timetable;
      localStorage['servicetable'] = servicetable;
      localStorage['bus_checked_date'] = today;
    }
    if (localStorage['bus_checked_date'] < today) {
      // get the data per day
      var timetable = JSON.stringify(this.update(0));
      var servicetable = JSON.stringify(this.update(1));
      if (JSON.parse(localStorage['timetable']).version != timetable.version) {
        localStorage['timetable'] = timetable;
      }
      if (JSON.parse(localStorage['servicetable']).version != servicetable.version) {
        localStorage['servicetable'] = servicetable;
      }
      localStorage['bus_checked_date'] = today;
    }
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
      str_split = line_split[i].split(',');
      str_split = str_split.filter(function (value, index, self) {
        return (self[index] != '' && self[index] != '\r');
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
