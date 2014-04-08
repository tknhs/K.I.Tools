/**
 * 暗号化／復号化
 **/
function EncDec(PV) {
  this.pv = PV;
  var keyword = localStorage[this.pv + 'passPhrase'];
  var bits = 1024;
  this.RSAkey = cryptico.generateRSAKey(keyword, bits);
  this.encData;
  this.decData;
}
EncDec.prototype.enc = function() {
  var PublicKeyString = cryptico.publicKeyString(this.RSAkey);
  var EncryptionResult = cryptico.encrypt(localStorage[this.pv + 'password'], PublicKeyString);
  this.encData = EncryptionResult.cipher;
  return this.encData;
}
EncDec.prototype.dec = function() {
  var DecryptionResult = cryptico.decrypt(localStorage[this.pv + 'encryptPassword'], this.RSAkey);
  this.decData = DecryptionResult.plaintext;
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
