(function(){
  // 拡張機能インストール・更新
  var extension_version = JSON.stringify(chrome.app.getDetails().version);
  if (localStorage['extension_version'] === undefined) {
    // インストール時
    localStorage['extension_version'] = extension_version;
    chrome.tabs.create({url:'chrome-extension://' + chrome.app.getDetails().id + '/options.html'});
  } else if (localStorage['extension_version'] != extension_version){
    // 更新時
    // id, password, passphraseなどを削除し，再登録のお願い
    localStorage.clear();
    localStorage['extension_version'] = extension_version;
    chrome.tabs.create({url: 'chrome-extension://' + chrome.app.getDetails().id + '/notice.html'});
  }
})();

/**
 * 暗号化／復号化
 **/
function EncDec(PV) {
  this.pv = PV;
  this.keyword = localStorage[this.pv + 'passPhrase2'];
  this.encData;
  this.decData;
}
EncDec.prototype.enc = function() {
  this.encData = CryptoJS.AES.encrypt(localStorage[this.pv + 'password'], this.keyword);
  return this.encData;
}
EncDec.prototype.dec = function() {
  var DecryptionResult = CryptoJS.AES.decrypt(localStorage[this.pv + 'encryptPassword'], this.keyword);
  this.decData = DecryptionResult.toString(CryptoJS.enc.Utf8);
  return this.decData;
}

function generate(ED, PV) {
  var pv = PV;
  var EncDecInit = new EncDec(pv);
  var encdec = ED;
  if (encdec == 'enc') return EncDecInit.enc();
  if (encdec == 'dec') return EncDecInit.dec();
}

/**
 * onMessage handler
 **/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  if (sender.tab) {
    if (request.ed == 'dec') {
      var EncDecInit = new EncDec(request.pv);
      var decryptPassword = EncDecInit.dec();
      sendResponse({
        id: localStorage[request.pv + 'student_id'],
        password: decryptPassword,
        mode: localStorage[request.pv + 'mode']
      });
    }
  }
});
