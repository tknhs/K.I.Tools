$('#auth_button').click(function() {
  chrome.runtime.getBackgroundPage(function(backgroundPage) {
    backgroundPage.checkAuth('options');
  });
});
