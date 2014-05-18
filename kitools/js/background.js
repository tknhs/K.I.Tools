(function() {
  chrome.tabs.create({url: 'chrome-extension://' + chrome.runtime.id + '/options.html'});
})();
