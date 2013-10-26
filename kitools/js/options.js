// 登録情報全削除
document.getElementById('delete').onclick = function() {
  chrome.storage.local.clear();
  location.reload();
}

// 登録しているか
document.body.onload = function() {
  chrome.storage.local.get(function(items) {
    var portal = items.portal;
    var regist = document.getElementById('registered');
    var bRegist = document.createElement('p');
    bRegist.innerHTML = (portal === undefined) ? 'No' : 'Yes';
    regist.appendChild(bRegist);
  });
}

// IDとPASSWORDをローカルストレージに保存
document.getElementById('save').onclick = function() {
  var id = document.getElementById('kit-id').value;
  var pass = document.getElementById('kit-pass').value;
  var portal = new Array();
  portal.push(enc(id));
  portal.push(enc(pass));
  chrome.storage.local.set({'portal':portal});
  location.reload();
}

// 暗号化
function enc(text) {
  var PassPhrase = 'kit student portal';
  var Bits = 512;
  var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
  var PlainText = text;
  var EncryptionResult = cryptico.encrypt(PlainText, MattsPublicKeyString);
  return EncryptionResult.cipher;
}
