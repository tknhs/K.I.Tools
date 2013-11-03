/**
 *
 *  Title  : Import to Google Calendar from K.I.T. Claendar
 *  Author : tknhs
 *
 **/

/**
 *  Google Calendar OAuth
 **/
document.getElementById('kit-calendar').addEventListener('click', checkAuth);

(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client.js?onload=OnLoadCallback';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

var clientId = '547277357116.apps.googleusercontent.com';
var apiKey = 'AIzaSyDxwCpk1ZV58sPEwIN-3HZvyDHVlEVvlPY';
var scopes = 'https://www.googleapis.com/auth/calendar';

// 認証チェック
function checkAuth() {
  gapi.client.setApiKey(apiKey);
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

// 認証結果
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    //makeApiCall();
  } else {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }
}


