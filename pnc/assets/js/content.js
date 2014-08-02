/*
 * 共通告知
 */
// localStorageが生成されていない
if (localStorage['noDisplayCommonNotice'] === undefined) {
  localStorage['noDisplayCommonNotice'] = JSON.stringify(new Array());
}

var ndcnList = JSON.parse(localStorage['noDisplayCommonNotice']);
var commonKokuchi = document.getElementsByClassName('kokuchi')[0];
var kokuchiList = commonKokuchi.getElementsByTagName('li');
// 非表示にしたリスト
var noDisplayedList = new Array();

for (var i=0; i<kokuchiList.length; i++) {
  var data = kokuchiList[i].getElementsByTagName('a')[0].href;
  data.search('(display_subject)\\(([0-9]+)');
  var subject = RegExp.$1;
  var number = RegExp.$2;

  // 非表示ボタンを作成
  var noDisplayBtn = document.createElement('button');
  noDisplayBtn.setAttribute('id', subject + ':' + number);
  noDisplayBtn.setAttribute('class', 'pnc_common-kokuchi');
  noDisplayBtn.innerText = '非表示';

  // 非表示ボタン追加
  kokuchiList[i].insertBefore(noDisplayBtn, kokuchiList[i].firstChild);

  // 非表示データを非表示にする
  for (var n=0; n<ndcnList.length; n++) {
    if (subject == ndcnList[n][0] && number == ndcnList[n][1]) {
      kokuchiList[i].style.display = 'none';
      noDisplayedList.push([subject, number])
    }
  }
}
// すでに存在しないデータを削除
localStorage['noDisplayCommonNotice'] = JSON.stringify(noDisplayedList);

/*
 * 非表示にした告知の確認機能
 */
var kokuchiHead = commonKokuchi.getElementsByClassName('header-k')[0];
var kokuchiBtn = document.createElement('button');
kokuchiBtn.setAttribute('class', 'pnc-delete');
kokuchiBtn.innerText = '非表示リスト';
kokuchiHead.appendChild(kokuchiBtn);

function createModalDialog() {
  // モーダルダイアログ作成
  var kokuchiModal = document.createElement('div');
  kokuchiModal.setAttribute('class', 'modal');
  kokuchiModal.setAttribute('id', 'pnc-delete');
  kokuchiModal.setAttribute('aria-hidden', 'true');
  var kokuchiModalDialog = document.createElement('div');
  kokuchiModalDialog.setAttribute('class', 'modal-dialog');
  var kokuchiModalHeader = document.createElement('div');
  kokuchiModalHeader.setAttribute('class', 'modal-header');
  kokuchiModalHeader.innerHTML = '<h2>非表示にした告知一覧</h2><a href="#" class="btn-close" aria-hidden="true">×</a>';
  var kokuchiModalBody = document.createElement('div');
  kokuchiModalBody.setAttribute('class', 'modal-body');
  for (var i=0; i<kokuchiList.length; i++) {
    var kokuchiData = kokuchiList[i].cloneNode(true);
    if (kokuchiData.getAttribute('style') == 'display: none;') {
      kokuchiData.removeAttribute('style');
      var kokuchiDataBtn = kokuchiData.childNodes[0];
      kokuchiDataBtn.setAttribute('id', 'pckd:' + i);
      kokuchiDataBtn.className = 'pnc_common-kokuchi-display';
      kokuchiDataBtn.innerText = '元に戻す';
      kokuchiModalBody.appendChild(kokuchiData);
    }
  }
  kokuchiModalDialog.appendChild(kokuchiModalHeader);
  kokuchiModalDialog.appendChild(kokuchiModalBody);
  kokuchiModal.appendChild(kokuchiModalDialog);
  document.body.appendChild(kokuchiModal);
}


/*
 * 学科連絡
 */
var gakkaKokuchi = document.getElementsByClassName('data-g')[0];
var gakkaKokuchiList = gakkaKokuchi.getElementsByTagName('li');
var gakkaAccordion = document.createElement('div');
gakkaAccordion.setAttribute('class', 'pnc_menu');

for (var i=0; i<gakkaKokuchiList.length; i++) {
  var gakkaSplit = gakkaKokuchiList[i].innerHTML.search('\<br\>');
  var gakkaTitle = gakkaKokuchiList[i].innerHTML.slice(0, gakkaSplit);
  var gakkaBody = gakkaKokuchiList[i].innerHTML.slice(gakkaSplit);
  gakkaBody.match(/(（[^ \t\r\n]+）)\<br\>/g);
  gakkaTitle += '<strong>' + RegExp.$1 + '</strong>';

  var gakkaLabel = document.createElement('label');
  gakkaLabel.setAttribute('class', 'pnc_label');
  gakkaLabel.setAttribute('for', 'pnc_panel' + i);
  gakkaLabel.innerHTML = gakkaTitle;
  var gakkaInput = document.createElement('input');
  gakkaInput.setAttribute('type', 'checkbox');
  gakkaInput.setAttribute('id', 'pnc_panel' + i);
  gakkaInput.setAttribute('class', 'pnc_on-off');
  var gakkaUl = document.createElement('ul');
  var gakkaLi = document.createElement('li');
  gakkaLi.innerHTML = gakkaBody;

  // アコーディオン要素作成
  gakkaUl.appendChild(gakkaLi);
  gakkaAccordion.appendChild(gakkaLabel);
  gakkaAccordion.appendChild(gakkaInput);
  gakkaAccordion.appendChild(gakkaUl);
}

gakkaKokuchi.removeChild(gakkaKokuchi.childNodes[1]);
gakkaKokuchi.appendChild(gakkaAccordion);


/*
 * クリックイベント
 */
document.addEventListener('click', function(e) {
  var target = e.target;

  // モーダルダイアログ
  if (target.tagName == 'BUTTON' && target.className == 'pnc-delete') {
    createModalDialog();
    location.hash = target.className;
  } else if (target.tagName == 'A' && target.className == 'btn-close') {
    var deleteModalDialog = document.getElementById('pnc-delete');
    deleteModalDialog.parentNode.removeChild(deleteModalDialog);
  }

  if (target.tagName == 'BUTTON' && target.className == 'pnc_common-kokuchi') {
    // 非表示
    var data = target.id.split(':');

    // 非表示データを追加
    var ndcn = JSON.parse(localStorage['noDisplayCommonNotice']);
    ndcn.push(data);
    localStorage['noDisplayCommonNotice'] = JSON.stringify(ndcn);

    // 対象のDOMを削除
    var rmNode = target.parentNode;
    rmNode.style.display = 'none';
  } else if (target.tagName == 'BUTTON' && target.className == 'pnc_common-kokuchi-display') {
    // 元に戻す
    var nckdId = target.id;
    var nckdNum = Number(nckdId.split(':')[1]);
    kokuchiList[nckdNum].removeAttribute('style');
    var nckdSubjectNumber = kokuchiList[nckdNum].childNodes[0].id.split(':');
    var ndcn = JSON.parse(localStorage['noDisplayCommonNotice']);
    ndcn.splice(ndcn.indexOf(nckdSubjectNumber), 1);
    localStorage['noDisplayCommonNotice'] = JSON.stringify(ndcn);
    document.getElementById(nckdId).parentNode.setAttribute('style', 'display: none;');
  }
}, false);

// http://portal10.mars.kanazawa-it.ac.jp/portal/student?_TRXID=RPTL1301&_INPAGEID=TOPPAGE&noticeno=2
