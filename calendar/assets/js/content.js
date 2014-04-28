/**
 *  DOM操作
 */
(function() {
  var s = $('font.font12').parent();
  s.css('width', '25%');
  s.next().css('width', '75%');
  $('th[width="50%"]').attr('width', '33%');
  var d = $('th[bgcolor="#9999ff"]');
  d.before('<th width="33%" height="30" align="center" valign="middle" bgcolor="#f999ff" nowrap="" class="shadow"><a href="" id="calendar" class="button">' + chrome.i18n.getMessage('optionsH1') + '</a></th>');
})();

/**
 *  カレンダー同期ボタンをクリック
 **/
$('a#calendar').click(function() {
  chrome.extension.sendRequest({ calendar: 'showDialog' }, function(response) {});
  calendarParse();
  return false;
});

/**
 *  カレンダーを解析
 **/
function calendarParse() {
  var base_url = location.href + '?_TRXID=RPTL0401B&_INPAGEID=DPTL0401&month=';
  var month = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03'];
  for (var i=0; i<month.length; i++) {
    var url = base_url + month[i];
    request(url, month[i]);
  }
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
          chrome.extension.sendMessage({
            title: date_day_evt,
            today: d1,
            tommorow: d2
          }, function(response) {});
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
            chrome.extension.sendMessage({
              title: date_day_evt,
              today: d1,
              tommorow: d2
            }, function(response) {});
          }
        }
      }
    }
  }
  xhr.send();
}
