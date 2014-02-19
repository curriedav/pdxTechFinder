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


          for (var i = 0; i < 4; ++i) {
            eventData.push(data[i]);
          };

          console.log("here is the 'data' array of objects...");
          console.log(data);


          console.log("only one object from data.......");
          console.log(data[0]);


          console.log("And now we try and get the actual info!...");
          var ourObject = data[0];
          console.log(ourObject);

          setTimeout(someFunc, 4000);

          function someFunc () {
            console.log("no... we wait...");
            console.log(ourObject.venue);
            console.log(ourObject.venue.lat);
          };



          /////////////////////////////////////////////////////////////////////////////////////




          var mapOptions = {
            center: new google.maps.LatLng(45.5200, -122.6819),
            zoom: 14
          };

          var contentString = "<p>Testing</p>";
          var myLatlng = new google.maps.LatLng(45.5200, -122.6819);
          var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title:"Hello World!"
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });


          return this;
      }

});

      module.exports = HomeView;