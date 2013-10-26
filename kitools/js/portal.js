
var id = document.getElementsByName('uid')[0];
var pass = document.getElementsByName('pw')[0];

if (id !== undefined && pass !== undefined){
  // ログインページ
  chrome.storage.local.get(function(items) {
    id.value = dec(items.portal[0]);
    pass.value = dec(items.portal[1]);
  });
}

// 復号化
function dec(text) {
  var PassPhrase = 'kit student portal';
  var Bits = 512;
  var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var DecryptionResult = cryptico.decrypt(text, MattsRSAkey);
  return DecryptionResult.plaintext;
}
