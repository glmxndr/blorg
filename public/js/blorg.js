if(!window.jQuery && window.Zepto) {
  window.jQuery = window.Zepto;
}

(function ($) {

  var queryHash = function () {
    // Return the article path if present in the hash
    var hash = location.hash;
    if (hash.match(/^#!\/article\//)) {
      return hash.replace(/^#!\/article\//, '');
    }
  };

  var org = new Org();
  var renderer = org.Renderers.html();

  var replaceAnchors = function ($obj) {
    // Modifying all the anchor links
    $('a', $obj || document).each(function(){
      var a = $(this);
      var href = a.attr('href');
      if (href && href.match(/^\.\/org\/(.*)\.org$/)) {
        var article = href.replace(/^\.\/org\/(.*)\.org$/, '/article/$1');
        a.attr('href', article);
      }
    });
  };

  var renderInto = function (url, $el) {
    $.get(url, function (data) {
      var root = org.Parser.parse(data);
      var html = renderer.render(root);    
      $el.html(html);
      replaceAnchors($el);
    });
  };

  $(document).on('click', 'a', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    if (href.match(/^\/article\//)) {
      e.preventDefault();
      var orgUrl = href.replace(/^\/article\//, '/org/') + '.org';
      location.hash = '#!' + href;
      $('a.selected').removeClass('selected');
      $this.addClass('selected');
      return false;
    }
  });

  $(window).on('hashchange', function(e) {
    loadArticle();
  });

  var loadIndex = function () {
    // Loading the index
    renderInto('/org/index.org', $('nav'));
  };

  var loadArticle = function () {
    // Loading the article if the URL specifies one
    var toLoad = queryHash();
    var path = location.pathname;
    if (!toLoad && path.match(/^\/article\//)) {
      toLoad = path.replace(/^\/article\//, '');
    }
    if (toLoad) { 
      renderInto('/org/' + toLoad + '.org', $('article')); 
    }
  };

  $(function () {
    loadIndex();
    loadArticle();
  });

}(Zepto));