/**
 *  位置情報: 扇が丘やつかほ判断
 **/
var geo = JSON.parse(localStorage['geo']);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      if (latitude<geo.lat && longitude<geo.lon) {
        console.log('aa');
        $('li[data-target="tab_yatsukaho"]')[0].click();
      }
    }
  );
}

/**
 * ionTabs
 **/
$.ionTabs("#tabs_bus, #tabs_location, #tabs_day");

/**
 * バスデータ最終更新日時
 **/
$('#last_update').text(chrome.i18n.getMessage('last_update') + localStorage['bus_checked_date']);
