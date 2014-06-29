// localStorageが生成されていない
if (localStorage['noDisplayCommonNotice'] === undefined) {
  localStorage['noDisplayCommonNotice'] = JSON.stringify(new Array());
}

// 共通告知
var ndcnList = JSON.parse(localStorage['noDisplayCommonNotice']);
var commonKokuchi = document.getElementsByClassName('kokuchi')[0];
var kokuchiList = commonKokuchi.getElementsByTagName('li');

for (var i=0; i<kokuchiList.length; i++) {
  var data = kokuchiList[i].getElementsByTagName('a')[0].href;
  data.search('(display_subject)\\(([0-9]+)');
  var subject = RegExp.$1;
  var number = RegExp.$2;

  // 非表示ボタンを作成
  var noDisplayBtn = document.createElement('button');
  noDisplayBtn.setAttribute('id', subject + ':' + number);
  noDisplayBtn.setAttribute('class', 'pnc');
  noDisplayBtn.innerText = '非表示';

  // 非表示ボタン追加
  kokuchiList[i].insertBefore(noDisplayBtn, kokuchiList[i].firstChild);

  // 非表示データを非表示にする
  for (var n=0; n<ndcnList.length; n++) {
    if (subject == ndcnList[n][0] && number == ndcnList[n][1]) {
      kokuchiList[i].style.display = 'none';
    }
  }
}

// 学科連絡
var gakkaKokuchi = document.getElementsByClassName('data-g')[0];
var kokuchiList = gakkaKokuchi.getElementsByTagName('li');
var gakkaAccordion = document.createElement('div');
gakkaAccordion.setAttribute('class', 'pnc_menu');

for (var i=0; i<kokuchiList.length; i++) {
  var gakkaSplit = kokuchiList[i].innerHTML.search('\<br\>');
  var gakkaTitle = kokuchiList[i].innerHTML.slice(0, gakkaSplit);
  var gakkaBody = kokuchiList[i].innerHTML.slice(gakkaSplit);

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

// クリックイベント
document.addEventListener('click', function(e) {
  var target = e.target;
  if (target.tagName == 'BUTTON' && target.className == 'pnc') {
    var data = target.id.split(':');

    // 非表示データを追加
    var ndcn = JSON.parse(localStorage['noDisplayCommonNotice']);
    ndcn.push(data);
    localStorage['noDisplayCommonNotice'] = JSON.stringify(ndcn);

    // 対象のDOMを削除
    var rmNode = target.parentNode;
    rmNode.style.display = 'none';
  }
}, false);
