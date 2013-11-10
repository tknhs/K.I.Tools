// window close
var origin = document.getElementById('origin');
if (origin !== null){
  var extension_id = ['chrome-extension://aaalhnakaggieflacdaljhkhkdcolffl',
                      'chrome-extension://kkmfijnemlnjbgagaimbmjehbalboboj',
                      'chrome-extension://hocoofagklejikikimldhhnjmdnkfpmh'];
  if (extension_id.indexOf(origin.value) != -1){
    window.close();
  }
}

