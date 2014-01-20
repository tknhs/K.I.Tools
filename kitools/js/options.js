/**
 *
 *  Title  : K.I.Tools Options
 *  Author : tknhs
 *
 **/

/**
 *  一般タブ - 有効/無効
 **/
// 設定削除
document.getElementById('general_delete').onclick = function(){
  chrome.storage.local.remove('general');
  registerTools();
}
// ローカルストレージに保存
document.getElementById('general_save').onclick = function(){
  var gPortal = document.getElementById('edportal').checked;
  var gAmalin = document.getElementById('edamalin').checked;
  var gVpn = document.getElementById('edvpn').checked;
  var gBus = document.getElementById('edbus').checked;
  var general = new Array();
  general.push(gPortal);
  general.push(gAmalin);
  general.push(gVpn);
  general.push(gBus);
  chrome.storage.local.set({'general':general});
  var g_register = document.getElementById('g_registered');
  g_register.innerHTML = 'Updated!';
  registerTools();
}

/**
 *  ポータルタブ - ログイン情報
 **/
// 設定削除
document.getElementById('portal_delete').onclick = function(){
  chrome.storage.local.remove('portal');
  registerTools();
}
// ローカルストレージに保存
document.getElementById('portal_save').onclick = function(){
  var id = document.getElementById('kit-id').value;
  var pass = document.getElementById('kit-pass').value;
  var portal = new Array();
  portal.push(enc(id));
  portal.push(enc(pass));
  chrome.storage.local.set({'portal':portal});
  registerTools();
}

/**
 *  VPNタブ - ログイン情報
 **/
// 設定削除
document.getElementById('vpn_delete').onclick = function(){
  chrome.storage.local.remove('vpn');
  registerTools();
}
// ローカルストレージに保存
document.getElementById('vpn_save').onclick = function(){
  var id = document.getElementById('vpn-id').value;
  var pass = document.getElementById('vpn-pass').value; 
  var radioList = document.getElementsByName('vpn-radio');
  for(var i=0; i<radioList.length; i++){
    if (radioList[i].checked){
      var mode = radioList[i].value;
    }
  }
  var vpn = new Array();
  vpn.push(enc(id));
  vpn.push(enc(pass));
  vpn.push(enc(mode));
  chrome.storage.local.set({'vpn':vpn});
  registerTools();
}

/**
 *  その他
 **/
// 情報を登録しているか
document.body.onload = registerTools();
function registerTools(){
  chrome.storage.local.get(function(items){
    // General
    var general = items.general;
    for (var i=0; i<general.length; i++){
      if (general[i] == undefined){
        general[i] = false;
      }
    }
    document.getElementById('edportal').checked = general[0];
    document.getElementById('edamalin').checked = general[1];
    document.getElementById('edvpn').checked = general[2];
    document.getElementById('edbus').checked = general[3];
    // Portal
    var portal = items.portal;
    var p_register = document.getElementById('p_registered');
    if (portal === undefined){
      p_register.innerHTML = '未登録';
      p_register.className = 'red';
    }
    else{
      p_register.innerHTML = '登録済';
      p_register.className = '';
    }
    // VPN
    var vpn = items.vpn;
    var v_register = document.getElementById('v_registered');
    if (vpn === undefined){
      v_register.innerHTML = '未登録';
      v_register.className = 'red';
    }
    else{
      v_register.innerHTML = '登録済';
      v_register.className = '';
    }
  });
}

// 暗号化
function enc(text){
  var PassPhrase = 'kit student portal';
  var Bits = 512;
  var RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var PublicKeyString = cryptico.publicKeyString(RSAkey);
  var PlainText = text;
  var EncryptionResult = cryptico.encrypt(PlainText, PublicKeyString);
  return EncryptionResult.cipher;
}
