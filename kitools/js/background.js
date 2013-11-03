// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45173902-1']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// インストール時
chrome.storage.local.get(function(items){
  if (items.general === undefined){
    _gaq.push(['_trackEvent', 'Installed']);
    chrome.storage.local.set({'general': new Array(false, true, false)});
  }
});

// ページアクションを表示
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf('http://portal10.mars.kanazawa-it.ac.jp/portal/student') != -1) {
    chrome.pageAction.show(tabId);
  }
});
