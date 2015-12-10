/* eslint-disable no-console */
/* globals Ractive */

(function(){

  var apiKey = '9wur7sdh84azzazdt3ye54k4',
    pageSize = 5,
    sections = ['uk-news', 'football', 'travel'];

  var postsTemplate = document.getElementById('tabs-posts-template').innerHTML,
    tabs = document.getElementById('tabs'),
    tabsContent = document.getElementById('tabs-content');


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


  // Add tab click event listener
  [].forEach.call(tabs.querySelectorAll('a'), (el) => {
    el.addEventListener('click', function (e){

      var target = el.getAttribute('href'),
        id = +target.substr(-1);

      toggleTabs( el.parentNode );

      toggleTabContent( target.substr(1) );

      // Check for new posts
      get( url(sections[id]) )
        .then(function(response) {
          makeList(id, JSON.parse(response) );
        })
        .catch(function(error) {
          console.error(error);
        });

      e.preventDefault();

    }, false);
  });


  function toggleTabs(el) {
    // Toggle tabs
    Array.prototype.filter
      .call(tabs.querySelectorAll('li'), (li) => li !== el)
      .forEach((li) => {
        li.setAttribute('aria-selected', false);
        li.classList.remove('tabs__tab--selected');
      });

    el.setAttribute('aria-selected', true);
    el.classList.add('tabs__tab--selected');
  }


  function toggleTabContent(id) {
    Array.prototype.forEach
      .call(tabsContent.querySelectorAll('.tabs__panel'), (panel) => {
        var matches = panel.id === id;
        panel.style.display = matches ? '' : 'none';
      });
  }



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
