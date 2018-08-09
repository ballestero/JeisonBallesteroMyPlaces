window.addEventListener('load', init, false);

function init() {
  var urlBase = "http://localhost:3000/";

  var venues = [];
  var categories = [];

  var newVenue = null;
  var newCategorie = null;


  getVenues();

  function getVenues() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 200) {

        var venuesData = JSON.parse(request.responseText);
        var items = venuesData.response.groups[0].items;

        console.log(items);

        createVenues(items);
        createCategories(items);


      }
    }

    request.open("GET", urlBase + 'venues', true);
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.send();
  }

  function createVenues(items) {

    let urlString = 'venues';

    for (let i = 0; i < items.length; i++) {

      let locationAddress = items[i].venue.location.address;

      if (locationAddress) {
        var addressVenue = items[i].venue.location.address;
      }else{
        var addressVenue = 'N/A';
      };

      newVenue = new Venue(items[i].venue.id, items[i].venue.name, addressVenue, items[i].venue.location.lat, items[i].venue.location.lng);
      venues.push(newVenue);

    };

    postData(venues, urlString);

  }


  function createCategories(items) {

    let urlString = 'categories';

    for (let i = 0; i < items.length; i++) {

      var venueId = items[i].venue.id;
      var categorie = items[i].venue.categories;

      for (let i = 0; i < categorie.length; i++) {

        newCategorie = new Categorie(venueId, categorie[i].id, categorie[i].name, categorie[i].pluralName, categorie[i].shortName, categorie[i].icon.prefix, categorie[i].icon.suffix, categorie[i].primary);
        categories.push(newCategorie);
       
        
      }

    };

    console.log(categories);
    postData(categories, urlString);

  }

  function sendPostCallback(event) {
    var request = event.target;
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        getVenues();

      } else {
        console.log('Error on request: ', request.status)
      }

    }
  }

  function postData(object, type) {


    let newObjectData = JSON.stringify(object);

    var request = new XMLHttpRequest();
    request.open('POST', urlBase + type, true);
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.onreadystatechange = sendPostCallback;
    request.send(newObjectData);

  };
};









