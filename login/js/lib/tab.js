// ページタブ
(function(){
  var menu = document.getElementById('tab_menu');
  var content = document.getElementById('tab_content');
  var menus = menu.getElementsByTagName('a');
  var current;
  for (var i=0; i<menus.length; i++){
    tab_init(menus[i], i);
  }
  function tab_init(link, index){
    var id = link.hash.slice(1);
    var page = document.getElementById(id);
    if (!current){
      current = {page:page, menu:link};
      page.style.display = 'block';
      link.parentNode.className = 'none';
    }
    else{
      page.style.display = 'none';
    }
    link.onclick = function(){
      current.page.style.display = 'none';
      current.menu.parentNode.className = '';
      page.style.display = 'block';
      link.parentNode.className = 'none';
      current.page = page;
      current.menu = link;
      return false;
    };
  }
})();

// ページタブ2
(function(){
  var menu = document.getElementById('time_menu');
  var content = document.getElementById('time_content');
  var menus = menu.getElementsByTagName('a');
  var current;
  for (var i=0; i<menus.length; i++){
    tab_init(menus[i], i);
  }
  function tab_init(link, index){
    var id = link.hash.slice(1);
    var page = document.getElementById(id);
    if (!current){
      current = {page:page, menu:link};
      page.style.display = 'block';
      link.parentNode.className = 'none';
    }
    else{
      page.style.display = 'none';
    }
    link.onclick = function(){
      current.page.style.display = 'none';
      current.menu.parentNode.className = '';
      page.style.display = 'block';
      link.parentNode.className = 'none';
      current.page = page;
      current.menu = link;
      return false;
    };
  }
})();

// ページタブ3
(function(){
  var menu = document.getElementById('sche_menu');
  var content = document.getElementById('sche_content');
  var menus = menu.getElementsByTagName('a');
  var current;
  for (var i=0; i<menus.length; i++){
    tab_init(menus[i], i);
  }
  function tab_init(link, index){
    var id = link.hash.slice(1);
    var page = document.getElementById(id);
    if (!current){
      current = {page:page, menu:link};
      page.style.display = 'block';
      link.parentNode.className = 'none';
    }
    else{
      page.style.display = 'none';
    }
    link.onclick = function(){
      current.page.style.display = 'none';
      current.menu.parentNode.className = '';
      page.style.display = 'block';
      link.parentNode.className = 'none';
      current.page = page;
      current.menu = link;
      return false;
    };
  }
})();

