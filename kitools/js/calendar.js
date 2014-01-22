/**
 *
 *  Title  : Import to Google Calendar from K.I.T. Claendar
 *  Author : tknhs
 *
 **/

/**
 *  Google Calendar OAuth
 **/
document.getElementById('kit-calendar').addEventListener('click', checkAuth);

(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client.js?onload=OnLoadCallback';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

// 開発, Web Store
var extension_id = ['chrome-extension://aaalhnakaggieflacdaljhkhkdcolffl/popup.html',
                    'chrome-extension://hocoofagklejikikimldhhnjmdnkfpmh/popup.html'];
if (location.href == extension_id[0]) {
  var clientId = '547277357116-d713cd7354e0vp2t95ov6v90add2l53o.apps.googleusercontent.com';
  var apiKey = 'AIzaSyAHlxBfNe32oSU96a1DRm--B_oN831VsTI';
}
else if (location.href == extension_id[1]) {
  var clientId = '547277357116-aejaf5d8qggolfhqr4unq8b3up2mmsj6.apps.googleusercontent.com';
  var apiKey = 'AIzaSyDsu5AVGBuD3PKa6HLE6-mVf7THKzEspPA';
}
var scopes = 'https://www.googleapis.com/auth/calendar';

// 認証チェック
function checkAuth() {
  gapi.client.setApiKey(apiKey);
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

// 認証結果
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    calendarParse();
  } else {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }
}

/**
 *  Parse Calendar
 **/
function calendarParse() {
  chrome.tabs.getSelected(null, function (tab) {
    var ele = document.createElement('p');
    ele.setAttribute('class', 'event');
    ele.innerHTML = '【新規追加イベント一覧】';
    var evt_cal = document.getElementById('appendcal');
    evt_cal.appendChild(ele);

    var vpn_url = 'https://ras.kanazawa-it.ac.jp/portal/,DanaInfo=portal10.mars.kanazawa-it.ac.jp+student';
    var normal_url = 'http://portal10.mars.kanazawa-it.ac.jp/portal/student';
    var base_url = (tab.url == normal_url) ? normal_url : vpn_url;
    var base_url = base_url + '?_TRXID=RPTL0401B&_INPAGEID=DPTL0401&month=';
    var month = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03'];
    for (var i=0; i<month.length; i++) {
      var url = base_url + month[i];
      request(url, month[i]);
    }
  });
}

function request(url, month) {
  var _url = url;
  var date_month = month;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', _url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var kit_cal = document.createElement('kit_cal');
      kit_cal.innerHTML = xhr.responseText;
      // 年
      var date_year = kit_cal.getElementsByClassName('font12')[1].children[0].innerHTML.slice(0, 4);
      // 変則授業日程
      var jugyoubi = kit_cal.getElementsByClassName('jugyoubi');
      for (var kc=0; kc<jugyoubi.length; kc++) {
        var eventJugyou = jugyoubi[kc].getElementsByClassName('eventJugyou');
        if (eventJugyou.length == 1) {
          // 変則授業日程がある
          var jugyoubi_children = jugyoubi[kc].children;
          for (var i=0; i<jugyoubi_children.length; i++) {
            // 日付
            if (jugyoubi_children[i].className.match('black|blue')) {
              var date_day = jugyoubi_children[i].innerHTML;
              today_day = (date_day.length == 1) ? '0' + date_day : date_day;
              var d1 = date_year +'-'+ date_month +'-'+ today_day;
              var date_d1 = new Date(d1);
              var d2 = new Date(d1);
              d2.setDate(date_d1.getDate() + 1);
              d2 = d2.toISOString().slice(0, 10);
            }
          }
          var date_day_evt = eventJugyou[0].innerHTML;
          get_events(date_day_evt, d1, d2);
        }
      }
      // 大学行事
      var data = kit_cal.getElementsByClassName('data');
      for (var kc=0; kc<data.length; kc++) {
        var d_event = data[kc].getElementsByClassName('event');
        if (d_event.length > 0) {
          // 行事がある
          var event_children = data[kc].children;
          for (var i=0; i<event_children.length; i++) {
            // 日付
            if (event_children[i].className.match('black|blue|red')) {
              var date_day = event_children[i].innerHTML;
              today_day = (date_day.length == 1) ? '0' + date_day : date_day;
              var d1 = date_year +'-'+ date_month +'-'+ today_day;
              var date_d1 = new Date(d1);
              var d2 = new Date(d1);
              d2.setDate(date_d1.getDate() + 1);
              d2 = d2.toISOString().slice(0, 10);
            }
          }
          for(var i=0; i<d_event.length; i++) {
            // イベントの分実行
            var date_day_evt = d_event[i].innerHTML;
            get_events(date_day_evt, d1, d2);
          }
        }
      }
    }
  }
  xhr.send();
}

/**
 *  Use Google Calendar API
 **/
// イベント取得
function get_events(title, today, tommorow) {
  gapi.client.load('calendar', 'v3', function() {
    var now_date = new Date();
    var now_month = String(Number(now_date.getMonth()) + 1);
    now_month = (now_month.length == 1) ? '0' + now_month : now_month;
    var now_day = now_date.getDate();
    now_day = (now_day.length == 1) ? '0' + now_day : now_day;
    var now_md = now_month + '-' + now_day;
    if ('01-01' <= now_md && now_md <= '03-31') {
      var year = now_date.getFullYear() - 1;
    } else {
      var year = now_date.getFullYear();
    }
    // リクエスト設定
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': year + '-04-01T00:00:00.000+09:00'
    });
    // リクエスト実行
    request.execute(function(resp) {
      for (var i in resp.items) {
        var a = resp.items[i];
        if (a.start.date == today && a.summary == title) {
          var cnt = 1;
        }
      }
      if (cnt === undefined) {
        insert_calendar(title, today, tommorow);
        var ele = document.createElement('p');
        ele.setAttribute('class', 'event');
        ele.innerHTML = '・' + today + ' ' + title;
        document.getElementById('appendcal').appendChild(ele);
      }
    });
  });
}

// イベント追加
function insert_calendar(title, today, tommorow) {
  var _title = title;
  var _start = today;
  var _end = tommorow;
  gapi.client.load('calendar', 'v3', function() {
    var resource = {
      'summary': _title,
      'start': {
        'date': _start
      },
      'end': {
        'date': _end
      }
    };
    var insert_req = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': resource
    });
    insert_req.execute(function(resp){
      //console.debug(resp);
    });
  });
}
