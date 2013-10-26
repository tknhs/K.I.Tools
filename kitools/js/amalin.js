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
    var lc_url = 'http://linkit.kanazawa-it.ac.jp/opac/cgi/searchS.cgi?AC=1&SC=F&RI10=IB&SW10=';

    if (local_url.search('/(dp|gp|exec\/obidos\/ASIN)(\/product)?\/([0-9]+)(X)?') != -1){
      /* a book page */
      isbn = RegExp.$3 + RegExp.$4;
      lc = lc_url + isbn;
      request(isbn, lc, 0);
    }
    if (local_url.search("(/s)[/|?]*") != -1){
      /* search results page */
      var sp = search_page();
      $.each(sp.id, function(i){
        isbn = sp.isbn[i];
        lc = lc_url + isbn;
        request(isbn, lc, 1, i, sp);
      });
    }
  }
  setTimeout(function(){ AmazonLinkit(prf, nw); }, 1500);
}

function search_page(){
  var divtag = document.getElementsByTagName('div');
  var d_id = new Array();
  var d_isbn = new Array();
  var cnt = 0;
  for (var i = 0; i < divtag.length; i++){
    if (divtag[i].id.search('result_[0-9]*') != -1){
      if (divtag[i].outerHTML.search('name=\"\([0-9]+)(X)?\"') != -1){
        d_id[cnt] = divtag[i].id;
        d_isbn[cnt] = RegExp.$1 + RegExp.$2;
        cnt++;
      }
    }
  }
  return {id : d_id, isbn : d_isbn};
}

function request(isbn, lc, whichreq, repeat, srch){
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

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var linkit = document.createElement('linkit');
      linkit.innerHTML = xhr.responseText;
      lend = (linkit.innerHTML.search('保管') != -1) ? '<b class="amalin-sub amalin-sub1">保管</b>' : '<b class="amalin-sub amalin-sub2">貸出</b>';
      var book = linkit.getElementsByTagName('a')[1];

      // LC have this Book.
      var ele = document.createElement('div');
      ele.setAttribute('class', 'amalin');
      ele.innerHTML = (
          (book == null)
          ? '<div class="amalin-content amalin-content0">LCに所蔵されていません</div>'
          : '<a href='+lc+' target="_blank" style="text-decoration: none;"><div class="amalin-content amalin-content1">LCに所蔵されています '+lend+'</div></a>'
      );

      // which request?
      if (wr == 0){
        /* book page */
        var i = 0;
        var nodelist = $('.buying');
        for (var nl = 0; nl < nodelist.length; nl++){
          if (nodelist[nl].id == ''){
            i++;
            if (i == 2){
              nodelist[nl].parentNode.insertBefore(ele, nodelist[nl]);
            }
          }
        }
        /* affiliate */
        var affi_url = 'http://www.amazon.co.jp/exec/obidos/ASIN/'+ _isbn +'/brsmc-22/ref=nosim';
        var affi = document.createElement('p');
        if (location.href == affi_url){
          affi.setAttribute('class', 'amalin-affi amalin-affi0');
          affi.innerHTML = 'ご協力ありがとうございます';
        }
        else{
          affi.setAttribute('class', 'amalin-affi amalin-affi1');
          affi.innerHTML = '<a href='+ affi_url +' style="text-decoration: none;">アフィリエイトに協力する</a>';
        }
        //$(affi).insertBefore('.parseasinTitle');
        $('.amalin').append(affi);
      }
      else if(wr == 1){
        /* search result page */
        if ($('#'+sp.id[rep]).attr('name') == sp.isbn[rep]){
          $('#'+sp.id[rep]+' h3.newaps').append(ele);
        }
      }
    }
  }
  xhr.send();
}

var nw = '';
var prf = location.href + location.search;
AmazonLinkit(prf, nw);

