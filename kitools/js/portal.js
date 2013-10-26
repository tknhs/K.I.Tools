/**
 *
 *  Title  : Auto Login for Student Portal
 *  Author : tknhs
 *
 **/

if (document.getElementsByTagName('font')[0].innerHTML != '学籍番号またはパスワードが違います。'){
  portal();
}

// 有効無効チェック
function portal(){
  chrome.storage.local.get(function(items){
    var general = (items.general === undefined) ? new Array(false, false): items.general;
    if(general[0]){
      loginPortal();
    }
  });
}

// ログインページ
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
  var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var DecryptionResult = cryptico.decrypt(text, MattsRSAkey);
  return DecryptionResult.plaintext;
}

