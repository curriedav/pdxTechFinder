;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function () {

	//Load Backbone app modules and npm dependencies
	var EventView = require('./views/event.js'),
	GroupView = require('./views/group.js'),
	HomeView = require('./views/home.js'),
	EventModel = require('./models/event.js'),
	GroupModel = require('./models/group.js'),
	HomeModel = require('./models/home.js');

	//App objects
	var app = {
		models: {},
		views: {},
		eventObj: {},
		groupObj: {},
		groupIds: [4808882,4300072,9523362,900711,490808,8407282,10030512,4523292,8206192,6693792,6063792],
		marker: {}
	};



	function meetUpEventRequest (groupIds) {
		var apiKey = '936f3b161c2450506d7b23683319',
			url='https://api.meetup.com/2/events?&sign=true&group_id=' + groupIds + '&key=' + apiKey + '&page=20';

		$.getJSON(url + "&callback=?", null, function(eventData) {
		 	app.eventObj = eventData;
		 	//console.log("this should be data from meetup object: " + app.eventObj);
		 	app.models.events.set(app.eventObj);
		 	app.models.home.set(app.eventObj);
		 	main();
		});
	}

	function meetUpGroupRequest (groupIds) {
		var apiKey = "936f3b161c2450506d7b23683319",
	 		url = "https://api.meetup.com/2/groups?&sign=true&group_id=" + groupIds + "&key=" + apiKey + "&page=20";

		$.getJSON(url + "&callback=?", null, function(groupData) {
		 	app.groupObj = groupData;
		 	//console.log("this is 11 groups: ");
		 	//console.log(app.groupObj);
		 	app.models.groups.set(app.groupObj);
		});
	}

	//Instantiate Backbone Models
	app.models.events = new EventModel();
	app.models.groups = new GroupModel();
	app.models.home = new HomeModel();


	//Instantiate Backbone Views
	app.views.event = new EventView({model: app.models.events});
	app.views.group = new GroupView({model: app.models.groups});
	function main () {
		
		app.views.home = new HomeView({model: app.models.home});
	}


	//Meetup API request using JSONP & Set Model Data
	meetUpGroupRequest(app.groupIds);
	meetUpEventRequest(app.groupIds);


	//Console access to app
	window.app = app;
});
},{"./models/event.js":2,"./models/group.js":3,"./models/home.js":4,"./views/event.js":5,"./views/group.js":6,"./views/home.js":7}],2:[function(require,module,exports){
var EventModel = Backbone.Model.extend({

});

module.exports = EventModel;
},{}],3:[function(require,module,exports){
var GroupModel = Backbone.Model.extend({

});

module.exports = GroupModel;
},{}],4:[function(require,module,exports){
var HomeModel = Backbone.Model.extend({

});

module.exports = HomeModel;
},{}],5:[function(require,module,exports){
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
},{"../../templates/events.hbs":15}],6:[function(require,module,exports){
var GroupView = Backbone.View.extend({
  	el: '#groups',

  	template: require('../../templates/groups.hbs'),

  	initialize: function () {
    	this.listenTo(this.model, 'change', this.render);
    	this.render;
  	},

	render: function () {
	   	this.$el.html(this.template(this.model.get('results') || { data: [] }));
	    return this;
	}
});

module.exports = GroupView;
},{"../../templates/groups.hbs":16}],7:[function(require,module,exports){
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
},{"../../templates/home.hbs":17}],8:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":9,"./handlebars/exception":10,"./handlebars/runtime":11,"./handlebars/safe-string":12,"./handlebars/utils":13}],9:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":10,"./utils":13}],10:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],11:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":9,"./exception":10,"./utils":13}],12:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],13:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":12}],14:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":8}],15:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"panel-group\" id=\"accordion\">\n  <div class=\"panel panel-default\">\n	  <div class=\"panel-heading\">\n    	<h4 class=\"panel-title\">\n      	<a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n        	<p>";
  if (helper = helpers.formattedTime) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.formattedTime); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " - ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n      	</a>\n    	</h4>\n	  </div>\n  \n 		<div id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"panel-collapse collapse\">\n    	<div class=\"panel-body\">\n      	";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	    	<p>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.venue)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<br>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.venue)),stack1 == null || stack1 === false ? stack1 : stack1.address_1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<br>\n	    	"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.venue)),stack1 == null || stack1 === false ? stack1 : stack1.city)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ", "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.venue)),stack1 == null || stack1 === false ? stack1 : stack1.state)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.venue)),stack1 == null || stack1 === false ? stack1 : stack1.zip)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p><br>\n	  		<a href=\"";
  if (helper = helpers.event_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.event_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Meetup Link</a>\n    	</div>\n  	</div>\n	</div>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
},{"handlebars/runtime":14}],16:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"panel-group\" id=\"accordion\">\n	<div class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      	<h4 class=\"panel-title\">\n        	<a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n          	<p>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n        	</a>\n      	</h4>\n    </div>\n\n  	<div id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"panel-collapse collapse\">\n    	<div class=\"panel-body\">\n      	<div class=\"row\">\n      		<div class=\"col-md-2\">\n      			<a href=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><img class=\"img-responsive\" src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.group_photo)),stack1 == null || stack1 === false ? stack1 : stack1.photo_link)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></a>\n      		</div>\n      		<div class=\"col-md-10\">\n      			";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      		</div>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
},{"handlebars/runtime":14}],17:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });
},{"handlebars/runtime":14}]},{},[1])
;