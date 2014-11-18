

	/* D3 Bubble Chart */

	var diameter = 500;

	var svg = d3.select('.chart').append('svg')
		.attr('width', diameter)
		.attr('height', diameter);

	var bubble = d3.layout.pack()
		.size([diameter, diameter])
		.value(function(d) {return d.size;}) // new data is loaded to bubble layout
		.padding(3);

	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("a simple tooltip");

	tooltip.text("my tooltip text");
	function drawBubbles(m) {

		// generate data with calculated layout values
		var nodes = bubble.nodes(processData(m))
			.filter(function(d) { return !d.children; }); // filter out the outer bubble

		// assign new data to existing DOM 
		var vis = svg.selectAll('circle')
			.data(nodes, function(d) { return d.name; })
			.on("mouseover", function(d, i) { 
				d3.selectAll("text")
					.classed("selected", function(e, j) { return j == i; })
					.attr("font-weight","")
					
				d3.select(".selected")
					.attr("font-weight","bold")
         });

		// enter data -> remove, so non-exist selections for upcoming data won't stay -> enter new data -> ...

		// To chain transitions, 
		// create the transition on the updating elements before the entering elements 
		// because enter.append merges entering elements into the update selection

		
		var duration = 200;
		var delay = 0;

		// update - this is created before enter.append. it only applies to updating nodes.
		vis.transition()
			.duration(duration)
			.delay(function(d, i) {delay = i * 7; return delay;}) 
			.attr('svg:title', function(d) { return d.title})
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.style('opacity', 1); // force to 1, so they don't get stuck below 1 at enter()

		// enter - only applies to incoming elements (once emptying data)	
		vis.enter().append('circle')
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.style('fill', function(d) { return d.className; })
			.style('background', function(d) { return d.className; })
			.style('opacity', 0) 
			.transition()
			.duration(duration * 1.2)
			.style('opacity', 1);

		// exit
		vis.exit()
			.transition()
			.duration(duration + delay)
			.style('opacity', 0)
			.remove();
			
	/*
		// enter - only applies to incoming elements (once emptying data)	
		vis.enter().append('circle')
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.attr('class', function(d) { return d.className; })
			.style('opacity', 0) 
			.transition()
			.duration(duration * 1.2)
			.style('opacity', 1);

		// exit*/
	}



	
	/* PubNub */

	function processData(data) {
		if(!data) return;
		
		var newDataSet = [];
		data.forEach(function(d) {
			var obj = {name: d.id, className: d.color, title: d.id, size: d.score};

			newDataSet.push(obj);
		});
		return {children: newDataSet};
	}



var redditSvg;
var previousData;

var POLL_SPEED = 2000;

function redditVis() {
  // setup a poll requesting data, and make an immediate request
  setInterval(requestData,POLL_SPEED);
  requestData();

  // initial setup only needs to happen once 
  // - we don't want to append multiple svg elements
  redditSvg = d3.select(".stories")
        .append("svg")
        .attr("width",document.body.clientWidth - 50)
        .attr("height",document.body.clientWidth -50)
}

function requestData() {
  // our jsonp url, with a cache-busting query parameter
  d3.jsonp("https://www.reddit.com/.json?jsonp=runVis&noCache=" + Math.random());
}


//////// PLEASE EDIT runVis /////////
/////////////////////////////////////
/////////////////////////////////////

function runVis(data) {

  // d3 never does anything automagical to your data
  // so we'll need to get data into the right format, with the
  // previous values attached
  var formatted = formatRedditData(data,previousData);

  // select our stories, pulling in previous ones to update
  // by selecting on the stories' class name
  var stories = redditSvg
     .selectAll("text")
     // the return value of data() is the update context - so the 'stories' var is
     // how we refence the update context from now on
     .data(formatted,function(d) {
       // prints out data in your console id, score, diff from last pulling, text
       
       // console.log(d.id,d.score,d.diff,d.title);

       // use a key function to ensure elements are always bound to the same 
       // story (especially important when data enters/exits)
       return d.id;
     });

  // ENTER context
  stories.enter()
    .append("text")
    .style("fill", function(d) { return d.color; })
	.attr('class', function(d) { return d.id; })
    .text(function(d){return d.score + " " + d.diff + " " + d.title})
    .attr("y", function(d,i){return 1.5*i + 1 + "em"})

  // UPDATE + ENTER context
  // elements added via enter() will then be available on the update context, so
  // we can set attributes once, for entering and updating elements, here
  stories
	.style("fill", function(d) { return d.color; })
    .text(function(d){return d.score + " " + d.diff + " " + d.title})

  // EXIT content
  stories.exit()
    .remove()
	
	drawBubbles(formatted);
	
}


//////// PLEASE EDI runVis() /////////
/////////////////////////////////////
/////////////////////////////////////


function formatRedditData(data) {
  // dig through reddit's data structure to get a flat list of stories
  var formatted = data.data.children.map(function(story) {
    return story.data;
  });
  // make a map of storyId -> previousData
  var previousDataById = (previousData || []).reduce(function(all,d) {
    all[d.id] = d;
    return all;
  },{});
  // for each present story, see if it has a previous value,
  // attach it and calculate the diff
  
  var i = 10;
var j = 10;
var k = 10;
var counter = 1;
  formatted.forEach(function(d) {
var nextColor = 'rgb(' + i + ',' + j + ',' + k + ')';
    d.previous = previousDataById[d.id];
    d.diff = 0;
	d.color = nextColor;
    if(d.previous) {
      d.diff = d.score - d.previous.score;
    }
	
			if(counter % 3 == 2){
				i = (i + 76)%200;
			}
			else if(counter % 3 == 1){
				j = (j + 59)%200;
			}
			else if(counter % 3 == 0){
				k = (k + 73)%200;
			}
			counter++;
  });
  // our new data will be the previousData next time
  previousData = formatted;
  return formatted;
}

redditVis();
