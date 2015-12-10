(function(){

  var apiKey = '9wur7sdh84azzazdt3ye54k4',
    pageSize = 5,
    sections = ['uk-news', 'football', 'travel'];

  var postsTemplate = document.getElementById('tabs-posts-template').innerHTML,
    tabs = document.getElementById('tabs');


  // Initialise requests
  get( url(sections[0]) )
  .then(function(response) {
    makeList(0, JSON.parse(response) );
    return get( url(sections[1]) );
  })
  .then(function(response) {
    makeList(1, JSON.parse(response) );
    return get( url(sections[2]) );
  })
  .then(function(response) {
    makeList(2, JSON.parse(response) );
  })
  .catch(function(error) {
    console.error(error);
  });



  tabs.querySelectorAll('a').addEventListener('click', function (e){
    e.preventDefault();
  }, false);



  /*
    Note:
    I originally made a single HTTP request (using ${sections.join('|')})
    but I couldn't figure out how to ensure that I always receive
    5 results from each section, so now I'm making 3 separate chained requests.
  */
  function url(section) {
    return `http://content.guardianapis.com/search?api-key=${apiKey}&page-size=${pageSize}&section=${section}`;
  }


  /*
    Note:
    Rather than destroying existing ractive elements and
    creating a new set each time, ultimately I'd prefer to
    bind this data to the HTML and update it properly.
    Sadly, there wasn't enough time to expore this fully.
  */
  function makeList(id, {response: {results: posts} }) {
    new Ractive({
      el: `tabs-${id}-posts`,
      template: postsTemplate,
      data: {posts}
    });
  }


  // XHR Promise function via Jake Archibald
  // See http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest
  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error('Network Error'));
      };

      req.send();
    });
  }


})();
