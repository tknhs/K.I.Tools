// localStorageが生成されていない
if (localStorage['noDisplayCommonNotice'] === undefined) {
  localStorage['noDisplayCommonNotice'] = JSON.stringify(new Array());
}

var ndcnList = JSON.parse(localStorage['noDisplayCommonNotice']);
var commonKokuchi = document.getElementsByClassName('kokuchi')[0];
var kokuchiList = commonKokuchi.getElementsByTagName('li');

for (var i=0; i<kokuchiList.length; i++) {
  var data = kokuchiList[i].getElementsByTagName('a')[0].href;
  data.search('(display_subject)\\(([0-9]+)');
  var subject = RegExp.$1;
  var number = RegExp.$2;
  console.log(subject + ' ' + number);

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
      console.log('ok');
      kokuchiList[i].parentNode.removeChild(kokuchiList[i]);
      i--;
    }
  }
}

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
    rmNode.parentNode.removeChild(rmNode);
  }
}, false);
