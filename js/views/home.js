      var HomeView = Backbone.View.extend({
       el: '#map-canvas',

       template: require('../../templates/home.hbs'),

       initialize: function () {
         this.listenTo(this.model, 'change', this.render);
         //this.listenTo(this.model, 'change', this.addmarker);
         this.render();
       },

       render: function () {
          var self = this,
          eventData = [],
          data = this.model.get('results') || { data: [] };

          ////////////////////////////////////////////////////////////////////////////////
          var markerArray = [],
          lat,
          lon;

          for (var i = 0; i < 3; ++i) {
            eventData.push([data[i].name, data[i].venue.address_1, data[i].venue.lat, data[i].venue.lon]); //


          };

          cartography(eventData);
                                  

            

          /////////////////////////////////////////////////////////////////////////////////////
          

          function cartography (eventData) {


            var mapOptions = {
              center: new google.maps.LatLng(45.5200, -122.6819),
              zoom: 14
            };
            console.log(eventData);
            var contentString;
            var myLatlng = new google.maps.LatLng(lat, lon);
            var map = new google.maps.Map(document.getElementById("map-canvas"),
              mapOptions);
            //var infowindow = new google.maps.InfoWindow();
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            var marker;


            for (var i = 0; i < eventData.length; i++) {
               marker = new google.maps.Marker({
                  position: new google.maps.LatLng(eventData[i][2], eventData[i][3]),//array[i].venue.lat, array[i].venue.lon
                  map: map,
                  title: contentString
                });
               contentString = eventData[i][0];
               
               console.log('boop!');

               infowindow = new google.maps.InfoWindow({
                   content: contentString
                });
              // google.maps.event.addListener(marker, 'click', function() {  
              //   infowindow.open(map, marker)
              // })
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              console.log('beep!');
              return function () {
                infowindow.content = eventData[i][0] + " - " + eventData[i][1];
                
                // infowindow.setContent(contentString); eventData[i][0]
                infowindow.open(map, marker);
              }
            })(marker, i));
            }
          
            

          return this;
        }
      }

});

      module.exports = HomeView;