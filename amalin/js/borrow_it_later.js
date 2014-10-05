function borrow_it_later(title, isbn, is_enter) {
  /**
   * Create DOM that Borrow It Later Button
   **/
  var ele = $('<button>');

  if (is_enter) {
    ele.attr('class', 'amalin-borrow-it-later-delete');
    ele.text(chrome.i18n.getMessage('amalinBorrowItLaterAlready'));
  } else {
    ele.attr('class', 'amalin-borrow-it-later');
    ele.text(chrome.i18n.getMessage('amalinBorrowItLaterYet'));
  }
  ele.attr('amalin-title', title);
  ele.attr('amalin-isbn', isbn);

  return $('<div>', {class: 'amalin-borrow'}).append(ele)
}

$(document).on('click', '.amalin-borrow-it-later', function(e) {
  /**
   * Click Event: Borrow It Later "Yet"
   **/
  var title = e.target.attributes[1].value;
  var isbn = e.target.attributes[2].value;

  e.target.setAttribute('class', 'amalin-borrow-it-later-delete');
  e.target.innerText = chrome.i18n.getMessage('amalinBorrowItLaterAlready');

  chrome.storage.sync.get(function(data) {
    var no_data = (JSON.stringify(data) === '{}') ? true : false;
    if (no_data) {
      data = [[title, isbn]];
    } else {
      data = data.amalin;
      data.push([title, isbn]);
    }
    chrome.storage.sync.set({'amalin': data});
    borrow_refresh();
  });
});

$(document).on('click', '.amalin-borrow-it-later-delete', function(e) {
  /**
   * Click Event: Borrow It Later "Already"
   **/
  var title = e.target.attributes[1].value;
  var isbn = e.target.attributes[2].value;
  var book = JSON.stringify([title, isbn]);

  if (e.target.innerText == chrome.i18n.getMessage('amalinBorrowItLaterSlider')) {
    var target = $('.amalin-borrow-it-later-delete[amalin-isbn=' + isbn + ']');
    target.attr('class', 'amalin-borrow-it-later');
    target.text(chrome.i18n.getMessage('amalinBorrowItLaterYet'));
  } else {
    e.target.setAttribute('class', 'amalin-borrow-it-later');
    e.target.innerText = chrome.i18n.getMessage('amalinBorrowItLaterYet');
  }

  chrome.storage.sync.get(function(data) {
    var data = data.amalin;
    var data_string = _.map(data, function(x) {return JSON.stringify(x)});
    var data_position = $.inArray(book, data_string);
    if (data_position != -1) {
      data.splice([data_position], 1);
    }
    chrome.storage.sync.set({'amalin': data});
    borrow_refresh();
  });
});

function borrow_insert(title, isbn) {
  /**
   * Insert the Borrow Data to Slidebar
   **/
  var ama_url = 'http://www.amazon.co.jp/dp/' + isbn;
  var lin_url = 'http://linkit.kanazawa-it.ac.jp/opac/cgi/searchS.cgi?AC=1&SC=F&RI10=IB&SW10=' + isbn;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', lin_url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var ele = $('<div>', {class: 'amalin-bil-div'});

      var ele_lend;
      if (xhr.responseText.search('保管') != -1) {
        var ele_lend = $('<button>', {class: 'amalin-bil-lend amalin-bil-lend-1'});
        ele_lend.text(chrome.i18n.getMessage('amalinStatus1'));
      } else {
        var ele_lend = $('<button>', {class: 'amalin-bil-lend amalin-bil-lend-0'});
        ele_lend.text(chrome.i18n.getMessage('amalinStatus0'));
      }
 
      var ele_delete = $('<button>', {class: 'amalin-borrow-it-later-delete'});
      ele_delete.attr('amalin.title', title);
      ele_delete.attr('amalin.isbn', isbn);
      ele_delete.text(chrome.i18n.getMessage('amalinBorrowItLaterSlider'));

      var ele_book = $('<a>', {class: 'amalin-bil-a'});
      ele_book.attr('href', ama_url);
      ele_book.attr('target', '_blank');
      ele_book.text(title);

      $(ele).append(ele_delete);
      $(ele).append(ele_lend);
      $(ele).append($('<br>'));
      $(ele).append(ele_book);
      $(ele).append($('<hr>'));
      $('#amalin-bil').append(ele);
    }
  }
  xhr.send();
}

function borrow_refresh() {
  /**
   * Refresh the Borrow Storage Data
   **/
  $('.amalin-bil-div').remove();

  chrome.storage.sync.get(function(data) {
    $('#sb-slidebar').text(data.amalin.length);

    $.each(data.amalin, function(i, val) {
      borrow_insert(val[0], val[1]);
    });
  });
}

(function($) {
  $(document).ready(function() {
    var slidebar_toggle = $('<div>', {class: 'sb-toggle-right'});
    slidebar_toggle.html('<p id="sb-slidebar"></p>');
    $('body').prepend(slidebar_toggle);
    var slidebar = $('<div>', {class: 'sb-slidebar sb-right sb-style-overlay sb-width-wide', id: 'amalin-bil'});
    $('body').append(slidebar);

    $.slidebars({});
    borrow_refresh();
  });
})(jQuery);
