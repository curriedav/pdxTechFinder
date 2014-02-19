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
        //console.log(data);

        //this.$el.html(this.model.get('gm_accessors_') || { data: [] });

      for (var i = 0; i < 4; ++i) {
        eventData.push(data[i]);
        //console.log(eventData);
      }
      var yo = this.$el.html(this.template(data));
      yo;
      console.log(yo);



      var mapOptions = {
        center: new google.maps.LatLng(45.5200, -122.6819),
        zoom: 14
      },
      contentString = "<p>Testing</p>",
      myLatlng = new google.maps.LatLng(45.5200, -122.6819),
      map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions),
      infowindow = new google.maps.InfoWindow({
        content: contentString
      }),
      marker = new google.maps.Marker({
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