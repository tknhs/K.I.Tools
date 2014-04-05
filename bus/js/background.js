// 拡張機能インストール・更新
var extension_version = JSON.stringify(chrome.app.getDetails().version);
if (localStorage['extension_version'] === undefined) {
  // インストール時
  localStorage['extension_version'] = extension_version;
  chrome.tabs.create({url:'chrome-extension://' + chrome.app.getDetails().id + '/options.html'});
} else if (localStorage['extension_version'] != extension_version){
  // 更新時
  localStorage['extension_version'] = extension_version;
}

// バスデータの更新チェック
var date_today = now_date()[0];
if (localStorage['bus_checked_date'] != date_today || localStorage['bus_checked_date'] === undefined) {
  bus_data.update_check(date_today);
}

// 扇が丘・やつかほの分断位置を保存
var geo_version = '20130123';
if (localStorage['geo'] === undefined || JSON.parse(localStorage['geo']).version != geo_version) {
  localStorage['geo'] = JSON.stringify({'version': geo_version, 'lat': 36.497, 'lon': 136.582});
}
