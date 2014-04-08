var pv;
var vpn_href = 'https://ras.kanazawa-it.ac.jp/dana-na/auth/url_default/welcome.cgi';
if (location.href == vpn_href) {
  pv = 'vpn_';
  portalVpn(pv);
}
if (document.getElementsByTagName('font')[0].innerHTML != '学籍番号またはパスワードが違います。' &&
    document.getElementsByClassName('button').length == 0) {
  pv = 'portal_';
  portalVpn(pv);
}

function portalVpn(Portal_or_VPN) {
  var ed = 'dec';
  var pv = Portal_or_VPN;
  chrome.extension.sendMessage({ ed: ed, pv: pv }, function(response) {
    var loginInfo = [response.id, response.password, response.mode];
    console.log(page[pv]);
    page[pv](loginInfo);
  });
}

var page = {
  vpn_: function (loginInfo) {
    // VPNログインページ
    var info = loginInfo;
    document.getElementById('username_5').value = info[0];
    document.getElementById('password_5').value = info[1];
    document.getElementById('realm_17').value = info[2];
    document.getElementById('btnSubmit_6').click();
  },
  portal_: function (loginInfo) {
    // 学生ポータル, 給与明細, 購買ワークフローログインページ
    var info = loginInfo;
    var id = document.getElementsByName('uid')[0];
    var pass = document.getElementsByName('pw')[0];
    if (id !== undefined && pass !== undefined) {
      id.value = info[0];
      pass.value = info[1];
      document.getElementsByName('SUBMIT')[0].click();
    }
  }
}
