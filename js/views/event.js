var EventView = Backbone.View.extend({
  	el: '#events',

  	template: require('../../templates/events.hbs'),

  	initialize: function () {
    	this.listenTo(this.model, 'change', this.render);
    	this.render;
  	},

	render: function () {
	   	var self = this,
      data = this.model.get('results') || { data: [] };
      
      data.forEach(function (mut) {
        mut.formattedTime = self.formatMeetupTime(mut.time);
      });

      this.$el.html(this.template(data));
	    return this;
	},

  formatMeetupTime: function (time) {
    var obj = "",
    week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
    timeStamp = new Date(time),
    hours = timeStamp.getHours(),
    mins = ":0" + timeStamp.getMinutes(),
    time;

    if (hours > 12) {
      time = hours - 12 + mins + " PM";
    } else {
      time = hours + mins + " AM";
    }

    return obj = week[timeStamp.getDay()] + ", " + month[timeStamp.getMonth()] + " " + timeStamp.getDate() + " at " + time;
  }
});

module.exports = EventView;