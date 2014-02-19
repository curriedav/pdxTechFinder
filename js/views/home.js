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
          var markerArray = [];

          for (var i = 0; i < 3; ++i) {
            eventData.push(data[i]);
            var lat,
                lon;
            lat = eventData[i].venue.lat;
            lon = eventData[i].venue.lon;
            flag = true;
            cartography(eventData);
          };
          
            

          /////////////////////////////////////////////////////////////////////////////////////
          

          function cartography (eventData) {


            var array = [];
            var mapOptions = {
              center: new google.maps.LatLng(lat, lon),
              zoom: 14
            };

            var contentString = "<p>Testing</p>";
            var myLatlng = new google.maps.LatLng(lat, lon);
            var map = new google.maps.Map(document.getElementById("map-canvas"),
              mapOptions);
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            
            for (var i = 0; i < 3; i++) {

              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(eventData[i].venue.lat, eventData[i].venue.lon),
                map: map,
                title:"Hello World!"
              });
            }
          
            

            markerArray.push(marker);
          
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });
          
            console.log('maptimeout!');

            

            if(markerArray.length == 3){
              mapDisplay(markerArray);
            }
          }

          //////////////

          function mapDisplay (markerArray) {




            markerArray[0];
            markerArray[1];
            markerArray[2];

            

            console.log(markerArray);

          }








          ///////////////


          return this;
      }

});

      module.exports = HomeView;