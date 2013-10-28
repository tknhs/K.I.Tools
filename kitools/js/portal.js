/**
 *
 *  Title  : Auto Login for Student Portal
 *  Author : tknhs
 *
 **/

var vpn_srch = 'https://ras.kanazawa-it.ac.jp/dana-na/auth/url_default/welcome.cgi'
if (location.href == vpn_srch){
  check('vpn');
}
if (document.getElementsByTagName('font')[0].innerHTML != '学籍番号またはパスワードが違います。'){
  check('sp');
}

// 有効無効チェック
function check(request){
  var _request = request;
  chrome.storage.local.get(function(items){
    var general = (items.general === undefined) ? new Array(false, false, false): items.general;
    if (_request == 'sp' && general[0]){
      loginPortal();
    }
    if (_request == 'vpn' && general[2]){
      loginVPN();
    }
  });
}

// VPNログインページ
function loginVPN(){
  chrome.storage.local.get(function(items){
    document.getElementById('username_5').value = dec(items.vpn[0]);
    document.getElementById('password_5').value = dec(items.vpn[1]);
    document.getElementById('realm_17').value = dec(items.vpn[2]);
    document.getElementById('btnSubmit_6').click();
  });
}

// 学生ポータルログインページ
function loginPortal(){
  var id = document.getElementsByName('uid')[0];
  var pass = document.getElementsByName('pw')[0];
  if (id !== undefined && pass !== undefined){
    chrome.storage.local.get(function(items){
      id.value = dec(items.portal[0]);
      pass.value = dec(items.portal[1]);
      document.getElementsByName('SUBMIT')[0].click();
    });
  }
}

// 復号化
function dec(text){
  var PassPhrase = 'kit student portal';
  var Bits = 512;
  var RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var DecryptionResult = cryptico.decrypt(text, RSAkey);
  return DecryptionResult.plaintext;
}

