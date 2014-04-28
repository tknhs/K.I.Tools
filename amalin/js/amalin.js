/**
 *
 *  Title  : Amazon.co.jp with LINKIT-II
 *  Author : tknhs
 *
 **/

function AmazonLinkit(prf, nw){
  if (prf == nw){
    nw = location.href + location.search;
  }
  else{
    prf = location.href + location.search;
    nw  = location.href + location.search;
    var local_url = location.pathname;
    var isbn;
    var lc;
    var lc_url = 'http://linkit.kanazawa-it.ac.jp/opac/cgi/searchS.cgi?AC=1&SC=F&RI10=IB&SW10=';

    if (local_url.search('/(dp|gp|exec\/obidos\/ASIN)(\/product)?\/([0-9]+)(X)?') != -1) {
      /* a book page (paper) */
      isbn = RegExp.$3 + RegExp.$4;
      lc = lc_url + isbn;
      request(isbn, lc, 0, 0, 0, 'paper');
    }
    else if (local_url.search('/(dp|gp|exec\/obidos\/ASIN)(\/product)?\/([A-Z0-9]+)') != -1) {
      /* a book page (kindle) */
      var format = $('div.cBox.dkBlueBox table tbody');
      for (var i=0; i<format.length; i+=1) {
        if (format[i].id != 'kindle_meta_binding_winner') {
          var isbn = format[i].firstElementChild.id;
          isbn = isbn.replace('tmm_', '');
          lc = lc_url + isbn;
          request(isbn, lc, 0, 0, 0, 'kindle');
        }
      }
    }
    if (local_url.search('(/s)[/|?]*') != -1) {
      /* search results page */
      var sp = search_page();
      $.each(sp.id, function(i) {
        isbn = sp.isbn[i];
        lc = lc_url + isbn;
        console.log(isbn);
        request(isbn, lc, 1, i, sp);
      });
    }
    if (local_url.search('/gp/bestsellers/books/') != -1) {
      /* bestsellers page */
      var isbns = bestsellers_page();
      $.each(isbns, function(i) {
        isbn = isbns[i];
        lc = lc_url + isbn;
        if (isbn != '') request(isbn, lc, 2, i);
      });
    }
  }
  setTimeout(function(){ AmazonLinkit(prf, nw); }, 1500);
}

function bestsellers_page() {
  var bestitems = document.getElementsByClassName('zg_itemRightDiv_normal');
  var b_isbn = new Array();
  for (var i=0; i<bestitems.length; i++) {
    if (bestitems[i].children[1].innerHTML.search('/dp/([0-9]+)(X)?') != -1){
      b_isbn[i] = RegExp.$1 + RegExp.$2;
    } else {
      b_isbn[i] = '';
    }
  }
  return b_isbn;
}

function search_page() {
  var kindle_asin = $('div[id^=result_]');
  var rslt = $('div[id^=result_] ul.rsltGridList.grey');
  var d_id = new Array();
  var d_isbn = new Array();
  var d_asin = new Array();
  var cnt = 0;
  for (var i=0; i<rslt.length; i+=1) {
    if (rslt[i].outerHTML.search('\/dp\/([0-9]+)(X)?') != -1) {
      d_id[cnt] = rslt[i].parentNode.id;
      d_isbn[cnt] = RegExp.$1 + RegExp.$2;
      kindle_asin[i].outerHTML.search('name=\"\([A-Z0-9]+)\"');
      d_asin[cnt] = RegExp.$1;
      cnt += 1;
    }
  }
  return {id: d_id, isbn: d_isbn, asin: d_asin};
}

function request(isbn, lc, whichreq, repeat, srch, type) {
  /**
   *  XMLHttpRequest
   *  @param lc       : required
   *  @param whichreq : required
   */
  var _isbn = isbn;
  var url = lc;
  var wr = whichreq;
  var rep = (repeat === undefined) ? 0 : repeat;
  var sp = (srch === undefined) ? 0 : srch;
  var book_type = type;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var linkit = document.createElement('linkit');
      linkit.innerHTML = xhr.responseText;
      lend = (linkit.innerHTML.search('保管') != -1)
        ? '<b class="amalin-sub amalin-sub1">'+chrome.i18n.getMessage('amalinStatus1')+'</b>'
        : '<b class="amalin-sub amalin-sub2">'+chrome.i18n.getMessage('amalinStatus0')+'</b>';
      var book = linkit.getElementsByTagName('a')[1];

      // LC have this Book.
      var ele = document.createElement('div');
      ele.setAttribute('class', 'amalin');
      ele.innerHTML = (
          (book == null)
          ? '<div class="amalin-content amalin-content0">'+chrome.i18n.getMessage('amalinLocation0')+'</div>'
          : '<a href='+lc+' target="_blank" style="text-decoration: none;"><div class="amalin-content amalin-content1">'+chrome.i18n.getMessage('amalinLocation1')+' '+lend+'</div></a>'
      );

      // which request?
      if (wr == 0) {
        /* book page */
        var i = 0;
        var nodelist = $('.buying');
        if (book_type == 'paper') {
          for (var nl = 0; nl < nodelist.length; nl++) {
            if (nodelist[nl].id == '') {
              i++;
              if (i == 2) {
                nodelist[nl].parentNode.insertBefore(ele, nodelist[nl]);
              }
            }
          }
        }
        else if (book_type == 'kindle') {
          $('div.buying#priceBlock').prepend(ele);
        }
      }
      else if (wr == 1) {
        /* search result page */
        if ($('#'+sp.id[rep]).attr('name') == sp.asin[rep]) {
          // asinコードが一致しているか
          $('#'+sp.id[rep]+' h3.newaps').append(ele);
        }
      }
      else if (wr == 2) {
        /* bestsellers page */
        var parent_ele = document.getElementsByClassName('zg_itemRightDiv_normal')[rep];
        parent_ele.insertBefore(ele, parent_ele.children[3]);
      }
    }
  }
  xhr.send();
}

var nw = '';
var prf = location.href + location.search;
AmazonLinkit(prf, nw);
