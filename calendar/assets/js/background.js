(function(){
  // 拡張機能インストール・更新
  var extension_version = JSON.stringify(chrome.app.getDetails().version);
  if (localStorage['extension_version'] === undefined) {
    // インストール時
    localStorage['extension_version'] = extension_version;
    localStorage['clientId'] = '547277357116-p8j95a69muvf04dbneaegmpikprg0030.apps.googleusercontent.com';
    localStorage['apiKey'] = 'AIzaSyDJoxdPitKdU_XzOU7fWs9oUwKo4hjHOtU';
    localStorage['scopes'] = 'https://www.googleapis.com/auth/calendar';
    chrome.tabs.create({url:'chrome-extension://' + chrome.app.getDetails().id + '/options.html'});
  } else if (localStorage['extension_version'] != extension_version){
    // 更新時
    localStorage['extension_version'] = extension_version;
  }
  // init gcal
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client.js?onload=OnLoadCallback';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

/**
 *  Google Calendar OAuth
 **/
// 認証チェック
function checkAuth(from) {
  var check_from = from;
  gapi.client.setApiKey(localStorage['apiKey']);
  if (check_from == 'options') {
    gapi.auth.authorize({
      client_id: localStorage['clientId'],
      scope: localStorage['scopes'],
      immediate: true
    }, handleAuthResultOptions);
  } else {
    gapi.auth.authorize({
      client_id: localStorage['clientId'],
      scope: localStorage['scopes'],
      immediate: true
    }, handleAuthResult);
  }
}
// 認証結果
function handleAuthResultOptions(authResult) {
  if (authResult && !authResult.error) {
    alert(chrome.i18n.getMessage('backgroundAlert'));
  } else {
    gapi.auth.authorize({
      client_id: localStorage['clientId'],
      scope: localStorage['scopes'],
      immediate: false
    }, handleAuthResult);
    return false;
  }
}
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // 認証済み
    var url = 'chrome-extension://' + chrome.runtime.id + '/calendar.html';
    var winWidth = 800;
    var winHeight = 450;
    var winLeft = (window.screen.width - winWidth) / 2;
    var winTop = (window.screen.height - winHeight) / 2;
    var options = 'width=' + winWidth + ', height=' + winHeight + ', left=' + winLeft + ', top=' + winTop;
    window.open(url, null, options);
  } else {
    // 認証されてない
    chrome.tabs.create({url:'chrome-extension://' + chrome.app.getDetails().id + '/options.html'});
  }
}

/**
 *  Use Google Calendar API
 **/
function get_year() {
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
  return year;
}
// イベント取得
function get_events(title, today, tommorow) {
  gapi.client.load('calendar', 'v3', function() {
    var year = get_year();
    // リクエスト設定
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': year + '-04-01T00:00:00.000+09:00'
    });
    // リクエスト実行
    request.execute(function(resp) {
      var item = _.filter(resp.items, function(i){
        return i.start.date == today && i.summary == title;
      });
      if (item.length == 0) {
        // Google Calendarにインサート
        insert_calendar(title, today, tommorow);

        var data = (localStorage['data'] === undefined) ? new Array() : JSON.parse(localStorage['data']);
        data.push({today: today, title: title});
        localStorage['data'] = JSON.stringify(data);
      }
      return;
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
      //console.log(resp);
    });
  });
}

/**
 *  カレンダー同期結果ウィンドウ生成イベント
 *  from Content Script
 **/
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.calendar == 'showDialog') {
    checkAuth('content');
  }
});

/**
 *  カレンダー同期結果ウィンドウ生成後同期開始イベント
 *  from Content Script
 **/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  if (sender.tab) {
    var title = request.title;
    var today = request.today;
    var tommorow = request.tommorow;
    get_events(title, today, tommorow);
  }
});
