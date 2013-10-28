/**
 *
 *  Title  : K.I.Tools
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
  var general = new Array();
  general.push(gPortal);
  general.push(gAmalin);
  general.push(gVpn);
  chrome.storage.local.set({'general':general});
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
    var general = (items.general === undefined) ? new Array(false, false, false): items.general;
    document.getElementById('edportal').checked = general[0];
    document.getElementById('edamalin').checked = general[1];
    document.getElementById('edvpn').checked = general[2];
    // Portal
    var portal = items.portal;
    var p_register = document.getElementById('p_registered');
    p_register.innerHTML = (portal === undefined) ? 'No' : 'Yes';
    // VPN
    var vpn = items.vpn;
    var v_register = document.getElementById('v_registered');
    v_register.innerHTML = (vpn == undefined) ? 'No' : 'Yes';
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

// オプションページタブ
(function(){
  var menu = document.getElementById('tab_menu');
  var content = document.getElementById('tab_content');
  var menus = menu.getElementsByTagName('a');
  var current;
  for (var i=0; i<menus.length; i++){
    tab_init(menus[i], i);
  }
  function tab_init(link, index){
    var id = link.hash.slice(1);
    var page = document.getElementById(id);
    if (!current){
      current = {page:page, menu:link};
      page.style.display = 'block';
      link.parentNode.className = 'none';
    }
    else{
      page.style.display = 'none';
    }
    link.onclick = function(){
      current.page.style.display = 'none';
      current.menu.parentNode.className = '';
      page.style.display = 'block';
      link.parentNode.className = 'none';
      current.page = page;
      current.menu = link;
      return false;
    };
  }
})();

