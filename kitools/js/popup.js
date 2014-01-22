// 位置情報: 扇が丘やつかほ判断
var geo = JSON.parse(localStorage['geo']);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      if (latitude<geo.lat && longitude<geo.lon) {
        document.getElementById('tab_yatsukaho').click();
      }
    }
  );
}
