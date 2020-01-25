//d3_module_V1.0
//Written by Todd Major using Mike Bostock's d3.js v4 javsacript library


//The first thing needed are the direct links to the d3.js library, along with a css file for formatting
//because line paths have a default to color under the curve.

//d3.js v4 source code found at hyperlink below. When I started making this module, I didn't realize
//that there were versions 3, 4, and 5. A lot of support/examples were using v3, but then Mike changed a lot of 
//the library to allow you to make it modular. So, I went with V4 because V5 was newer and I didn't
//know what was better. V5 seems solid in hindsight.
//<script src="http://d3js.org/d3.v4.min.js"></script>

///This is a required style sheet. This is needed because by default, under linepaths
//are filled in and I did not want that.
//<link rel="stylesheet" type="text/css" href="d3_module_css.css">

//Need this div container to put chart as an SVG object
//<div id="chart_area" style="display: inline-block"></div>

//In case you have a continuous line bar for a heat map, you need the defined div tag
//<div id="legend" style="display: inline-block"></div> 

//You will obviously need the path to this file.
//<script src="/../d3_module.js"></script>


/*
This module allows you to plot a scatter/line path, bar chart, stacked bar chart, and a map.
Depending on the graph you want, you will need different expression for the x and y scales.
For instance, a scatterplot requires a linear x and y axis. A histogram requires a linear y axis but a 
scaleBand for the x axis, etc. You could have a scatterplot that uses a time axis. In most cases I've built
 in those options when needed.
*/

//Every chart has the following inputs, passed through as a dictionary using a function:
/*
function generateParameters(){
	var parameterObject = {
		divName: //this is the div tag id used in the main file
		chart_type: //options: bar, stacked_bar, scatterplot, map
		backgroundcolor: I like smokewhite but any hexadecimal color can be used
		data: //this is JSON object. In PHP I would use json_encode() to make this work easily.
		margin:  //space between the edge of the chart and the total SVG area
		width: //how wide to make the SVG object
		height: //how tall to make SVG object
		colorScale_domain: //I'll describe domain and range later, but this is an array of the keys to plot each curve with different colors
		colorScale_range: //the array of colors to use for the coloring of the curves
		click_url: //this is a callback function to go to a hyperlink by clicking on data in the chart

		//As a good scientist and engineer, an xLabel should always be defined
		xLabel: //text on xAxis
		if (typeof xLabel != 'undefined') }
			xLabelTransform_y: //y height of label
			xLabelTransform_dy: //to move the label up and down a little
		}

		//As a good scientist and engineer, a yLabel should always be defined
		yLabel: //text on yAxis
		if (typeof xLabel != 'undefined') {
			yLabelTransform_x: //x axis offset of yLabel
			yLabelTransform_dx: //subtle offset of yLabel
			yLabelTransform_y: //y axis offset of yLabel
			yLabelTransform_dy: //subtle y axis offset of yLabel
		}

		if (chart_type != 'map') {
			xAxisFontSize: //self-explanatory
			yAxisFontSize: //self-explanatory
			xAxisTransform_x: //same idea as other offsets
			xAxisTransform_dx: //same idea as other offsets
			xAxisTransform_y: //same idea as other offsets
			xAxisTransform_dy: //same idea as other offsets
		} 

		continuousLegend: //'yes' or 'no'
		makeLegend: 
		if (makeLegend == 'yes') {
			legendKey: //what will be on each legend
			legendRect_x: //rectangle x offset to show off color
			legendRect_y  //rectangle y offset to show off color
			legendRect_width: //how big is rectangle in x width
			legendRect_height: //how big is rectangle in y width
			legendText_x: //offset of legend text in x
			legendText_dx: //subtle offset of material in x
			legendText_y: //offset of legend text in y
			legendText_dy: //subtle offset of legend text in y
		} 

		tooltipText //function call to have tooltip when hovering over data
		tooltip_x: //tooltip x offset
		tooltip_dx: //subtle x offset
		tooltip_y: //subtle y offset
		tooltip_dy: //subtle y offset
		tooltipFontSize: //how big is fontsize for tooltip
		xTooltipPos: //location of tooltip can be stack or can be where mouse is using this.d3.mouse[0]
		yTooltipPos: //y location of tooltip, again static or where mouse is using d3.this.mouse[1]

		if (chart_type = 'stacked_bar') {
		//Stacked bar chart specific variables:
		//go to github to see definitions: https://github.com/d3/d3-shape/blob/v1.3.7/README.md#stack
			key_list: 
			stack:
			series: 
			barStack:
			xScale_Domain_bar: 
			yScale_Domain: 
		}

		if (chart_type = 'bar') {
		//Bar chart specific variables:
			xScale_Domain_bar: //array for bars on x axis
			yScale_Domain: //array of min and max data in y direction
			xData: //define x data 
			yData: //define y data
		}

		if (chart_type = 'map') {
		//Map chart specific variables:
			substrateSize: //size of circle for wafermap
			yScale_Domain: //array of min and max of data
			circle: //yes or no depending on if you want to see circle
			yData: //defiine y data
		}

		if (chart_type = 'histogram') {
		//Hist chart specific variables:
			num_bins: //doesn't quite work right but you can roughly decide how many bins you want
			plot_ll: //minimum x value to show up
			plot_ul: //maximum y value to show up
			xScale_Domain: //array  of min and max x data
			yData: //define y data
		}

		//remaining chart type: scatterplot w/line
		//Scatter/Line chart specific variables:
			xScale_time: //yes or no if you want x axis to be time
			flat_data: //if you have multiple curves to plot together, you need the max and min of all arrays to get the domain to work correctly
			xScale_begin: 
			xScale_end:
			xScale_Domain: //array [xScale_begin, xScale_end]
			yScale_begin:
			yScale_end:
			yScale_Domain: //array [yScale_begin, yScale_end]
			xData: //define x data
			yData: //define y data
			dotSize: //how big to make dots
		
		return parameterObject;
}

*/


//Finally, this is an example of how you call the render function to graph
/* 
<script>
var request = generateParameters();
render(request); //function call 
</script>
*/


//Starting off, render is the function to make the chart. You must pass in dictionary of parameters.
var render = (parameterObject) => {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//svg is your chart.
var svg = d3.select(parameterObject.divName) // Declare svg object and append to the scatter_area <div>, note that # is needed for the class
    .append("svg") //svg object now in chart_area div
		.attr("width", parameterObject.width + parameterObject.margin.left + parameterObject.margin.right) //width calculation of svg
		.attr("height", parameterObject.height + parameterObject.margin.top + parameterObject.margin.bottom) //height calculation of svg
		.attr("class", "graph-area")
		.style("border-style","solid")
		.style("background-color", parameterObject.backgroundcolor)
    .append("g") // With this convention, all subsequent code can ignore margins. See https://bl.ocks.org/mbostock/3019563
		.attr("transform", "translate(" + parameterObject.margin.left + "," + parameterObject.margin.top + ")"); //put in margins so i can see the axis correctly

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Domain is used to define the "data space". 
//Range refers to the screen space and how data is mapped to screen. 
//See the explanation at: https://www.dashingd3js.com/d3js-scales

// Define xScale
// Bar Chart or stacked bar chart
if (parameterObject.chart_type == "stacked_bar" || parameterObject.chart_type == "bar") {
	var xScale = d3.scaleBand() //for bar chart
		.domain(parameterObject.xScale_Domain_bar)
		.range([0, parameterObject.width])
		.padding(0.1);
}

else if (parameterObject.chart_type == "map") {
	var xScale = d3.scaleLinear()
	.domain([0, parameterObject.substrateSize ]) // orgininally used max but i can edit that...d3.max(data0, xData)]) //alternatively I see this syntax: .domain([0, d3.max(data0, function(d) { return d.x; })]);
	.range([0, parameterObject.width]);
}

else if (parameterObject.chart_type == "histogram") {
	//linear scale for histogram, scatter, line chart
	var xScale = d3.scaleLinear()
		.domain(parameterObject.xScale_Domain) 
		.range([0, parameterObject.width]).nice(parameterObject.num_bins);

	var histogram = d3.histogram()
	    .value(parameterObject.yData)
	    .domain(xScale.domain())
	    .thresholds(xScale.ticks(parameterObject.num_bins));

	var bins = histogram(parameterObject.data);
}

else {
	// for scatterplot
	if (parameterObject.xScale_time == 'yes') {
	
	var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
	for (k = 0; k < parameterObject.data.length; k++) {	
		parameterObject.data[k].forEach(function(d) {
	        d['xValue'] = parseDate(d['xValue']);
	    });
	}
	
	var xScale = d3.scaleTime()
		.domain(parameterObject.xScale_Domain) 
		.range([0, parameterObject.width]);
	}



	else {
		var xScale = d3.scaleLinear()
			.domain(parameterObject.xScale_Domain) 
			.range([0, parameterObject.width]);
		}
}

//DEFINING LINEAR SCALE yScale
if (parameterObject.chart_type == "histogram") {
var yScale = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)])
	.range([parameterObject.height, 0]).nice(); //starts in top left, so height is first parameter
}

else {
//var yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.Total)])
var yScale = d3.scaleLinear().domain(parameterObject.yScale_Domain)
	.range([parameterObject.height, 0]); //starts in top left, so height is first parameter
}

//DEFINING A COLOR SCALE
if (parameterObject.chart_type == "map") {
	//var colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([d3.min(data, function(d) { return d.stat; }), d3.max(data, function(d) {return d.stat})]);
	var colorScale = d3.scaleLinear().domain(parameterObject.colorScale_domain).range(parameterObject.colorScale_range).interpolate(d3.interpolateRgb.gamma(2));
	//var colorScale = d3.scaleQuantize().domain(parameterObject.colorScale_domain).range(["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]);
}

else {
var colorScale = d3.scaleOrdinal(parameterObject.colorScale_range);
	//.range(colorScale_range);

//DEFINING DOMAIN OF THE COLORSCALE
colorScale.domain(parameterObject.colorScale_domain);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Make xAxis object all charts
var xAxis = d3.axisBottom(xScale)
	.tickSizeOuter(0);

if (parameterObject.chart_type != "map") {
//append xAxis to svg through g
xAxisg = svg.append("g")
	.call(xAxis)
    .attr("transform", "translate(0," + parameterObject.height + ")") //this translation is so the x axis is at the bottom of the figure instead of the top.
    .style("font-size", parameterObject.xAxisFontSize); 

//formatting xAxis    
xAxisg.selectAll("text")
    	.attr("transform", "rotate(270)")
    	.attr("x", parameterObject.xAxisTransform_x)
    	.attr("dx", parameterObject.xAxisTransform_dx)
    	.attr("y", parameterObject.xAxisTransform_y)
    	.attr("dy", parameterObject.xAxisTransform_dy)
    	.attr("text-anchor", "end")
    	;

//removing unnecessary tick line
xAxisg.selectAll(".tick line").remove();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Make yAxis object
var yAxis = d3.axisLeft(yScale)
	.tickSize(-parameterObject.width)
	.tickPadding(5)
	.tickSizeOuter(0); //you need this or an obnoxious line is on the top of the figure.......

 //append yAxisg to svg through g
if (parameterObject.chart_type != "map") {
svg.append("g")
	.attr("class", "yticks") //defining the class of the ticks so i can use css
    .call(yAxis)
     .style("font-size", parameterObject.yAxisFontSize); //a translate is not needed here because the y axis starts in the upper left corner
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (parameterObject.chart_type != "map") {
//append xAxis scale label
svg.append("text")             
    .attr("transform", "translate(" + (parameterObject.width/2) + " ," + (parameterObject.height + parameterObject.margin.top) + ")")
    .style("text-anchor", "middle")
    .attr("y", parameterObject.xLabelTransform_y)
    .attr("dy", parameterObject.xLabelTransform_dy)
    .text(parameterObject.xLabel);

//append yAxis scale label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", parameterObject.yLabelTransform_x) // since we are rotated by 90 degrees, this is "x" direction
    .attr("x", parameterObject.yLabelTransform_y)
    .attr("dy", parameterObject.yLabelTransform_dx) // can use this for fine movement left and right
    .attr("dx", parameterObject.yLabelTransform_dy)
    .style("text-anchor", "middle")
    .text(parameterObject.yLabel);  
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DATA INPUT AND RENDERING!!!

//STACKED BAR CHART ONLY, USED TO GIVE COLOR TO EACH PART OF STACKED BAR
if (parameterObject.chart_type == "stacked_bar") {
	var groups = svg.append("g")
		.selectAll(".series")
		.data(parameterObject.series)
		.enter()
		.append("g")
			.attr("class", "series")
			.attr("id", d => d.key)
			.attr("fill", d => colorScale(d.key));

	//MAKES STACKED BAR
	var rect = groups.selectAll("rect")
		.data(function(d) { return d; })
		.attr("id", d => d.key)
		.enter()
		.append("rect")
			.attr("x", d => xScale(eval(parameterObject.barStack)))
			.attr("y", d => yScale(d[1]))
			.attr("height", d => yScale(d[0]) - yScale(d[1]))
			.attr("width", xScale.bandwidth())
			.on("mouseover", function () {
				tooltip.style("display", null);
			})

			.on("mouseout", function () {	
				tooltip.style("display", "none");
			})

			.on("mousemove", function (d) {
				var xPosition = eval(parameterObject.xTooltipPos);
	      		var yPosition = eval(parameterObject.yTooltipPos);
	      		var subgroupName = d3.select(this.parentNode).datum().key;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")") //putting tooltip in bottom left corner of figure
					.select("text").text(parameterObject.tooltipText(d) + subgroupName);			
					//.select("text").text((d[1]-d[0]) + " Wafers at " + subgroupName);
					//.select("text").text((d[1]-d[0]) + " Wafers at " + subgroupName + " in " + eval(barStack) ); //this text was too long for figure
					
				// couldn't get multiline tooltip to work but a solution is here: https://stackoverflow.com/questions/16701522/how-to-linebreak-an-svg-text-within-javascript
			})
			.on("click", parameterObject.click_url) //{
	    		//window.location.href = click_url();
		//})
		;
}

else if (parameterObject.chart_type == "bar") {

//BAR CHART
	var rect = svg.selectAll('rect')
	    .data(parameterObject.data)
		.enter()
		.append('rect')
		.attr('x', d => xScale(xData(d)))
		.attr('y', d => yScale(yData(d)))
		.attr('width', xScale.bandwidth()) //could use function (d) {xScale(d.x)}
		.attr('height', d => parameterObject.height - yScale(yData(d))) //could use function (d) {yScale(d.y)}
		//.attr("clip-path", "url(#mask)")
		//.on("mouseover", function () {
		//	tooltip.style("display", null);
		//})

		.on("mouseout", function () {	
			tooltip.style("display", "none");
		})

		.on("mouseover", function (d) {
			tooltip.attr("transform", "translate(" + parameterObject.xTooltipPos + "," + parameterObject.yTooltipPos + ")") //putting tooltip in bottom left corner of figure
				.select("text").text(parameterObject.tooltipText(d));
			//.select("text").text(xData(d) + ", " + yData(d)); //could use d.xValue, d.yValue
		})
		.on("click", parameterObject.click_url);
}

else if (parameterObject.chart_type == "map") {
	
	if (parameterObject.circle = "yes") {
		//Add cicrle for wafer
		var circ = svg.append("circle")
			.attr("cx", parameterObject.width/2)
			.attr("cy", parameterObject.height/2)
			.attr("r", parameterObject.width/2)
			.style("stroke", "steelblue")
			.style("fill", "none")
	}

	// Adding rectangles
	var rect = svg.selectAll("rect")
		.data(parameterObject.data)
		.enter()
		.append("rect");

	rect.attr("x", d => xScale(d.x_coord)) //could use function (d) {xScale(d.x)}
		.attr("y", d => parameterObject.height - yScale(d.y_coord)) //could use function (d) {yScale(d.y)}
		.attr('width', d => xScale(d.x_width)) //could use function (d) {xScale(d.x)}
		.attr('height', d => parameterObject.height - yScale(d.y_width)) //could use function (d) {yScale(d.y)
		.style("fill", d => colorScale(d.stat))
		.style("fill-opacity", 0.3)
		.on("mouseover", function () {
			tooltip.style("display", null);
		})

		.on("mouseout", function () {	
			tooltip.style("display", "none");
		})
		
		.on("mousemove", function (d) {
			var xPosition = eval(parameterObject.xTooltipPos);
		    var yPosition = eval(parameterObject.yTooltipPos);
			tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")") //putting tooltip in bottom left corner of figure
				.select("text").text(parameterObject.tooltipText(d))
		})

		.on("click", parameterObject.click_url);

	svg.append("g")
		.selectAll("text")
		.data(parameterObject.data)
		.enter()
		.append("text")
		.attr("x", d => xScale(d.x_width)/2 + xScale(d.x_coord))
	    .attr("y", d => parameterObject.height - yScale(d.y_coord) + (parameterObject.height - yScale(d.y_width))/2)
	    .style("text-anchor", "middle")
	    .style("font-size", "10px")
	    .style("fill", "black")
	    .text(parameterObject.yData) ;
	    
}

else if (parameterObject.chart_type == "histogram") {

	// Adding rectangles
	var rect = svg.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
		.attr('x', 1)
		.attr("transform", function(d) {
		  return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
		.attr("width", xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
        .attr("height", function(d) { return parameterObject.height - yScale(d.length) })
        .on("mouseover", function () {
			tooltip.style("display", null);
		})

		.on("mouseout", function () {	
			tooltip.style("display", "none");
		})

		.on("mousemove", function (d) {
			var xPosition = eval(parameterObject.xTooltipPos);
		    var yPosition = eval(parameterObject.yTooltipPos);
			tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")") //putting tooltip in bottom left corner of figure
				.select("text").text(parameterObject.tooltipText(d));
				//.select("text").text(d.length + " Cell(s) between " + d.x0 + " and " + d.x1);
		})
		.on("click", parameterObject.click_url);
}

else {

//SCATTERPLOT + LINE PLOT

	var chart_class = {};
	var chart_id = {};

	for (k = 0; k < parameterObject.data.length; k++) {

		chart_class[k] = {
			value: 'data' + k + 'dot',
			//activeline: false
		};

		chart_id[k] = {
			value: 'data' + k + 'line',
			//activeline: false
		};	

	}

	function show_chart_class() {
		console.log(chart_class);
		return chart_class;
	}
	
	function show_chart_id() {
		//console.log(chart_id);
		return chart_id;
	}

	chart_class_return = show_chart_class();
	chart_id_return = show_chart_id();

	// NOTE: OPTION FOR MULTIPLE CURVES TO BE DRAWN IE IN CURVES
	//for loop of each selected data array
	for (k = 0; k < parameterObject.data.length; k++) {

		svg.selectAll("dot")
		    .data(parameterObject.data[k])
			.enter()
			.append("circle")
			.attr("class", chart_class[k].value)
			//.style("opacity", 0)
			//.attr("cx", d => xScale(parameterObject.xData(d))) //could use function (d) {xScale(d.x)}
			.attr("cx", d => xScale(d.xValue)) //could use function (d) {xScale(d.x)}
			//.attr("cy", d => yScale(yData(d))) //could use function (d) {yScale(d.y)}		
			.attr("cy", d => yScale(d.yValue)) //could use function (d) {yScale(d.y)}
			.attr("r", parameterObject.dotSize)
			.attr("fill", d => colorScale(k))
			.attr("clip-path", "url(#mask)")
			.on("mouseover", function () {
				tooltip.style("display", null);
			})

			.on("mouseout", function () {	
				tooltip.style("display", "none");
			})

			.on("mouseenter", function (d) {
				var xPosition = eval(parameterObject.xTooltipPos);
		      	var yPosition = eval(parameterObject.yTooltipPos);
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")") //putting tooltip in bottom left corner of figure
				.select("text").text(parameterObject.tooltipText(d));
				//.select("text").text(xData(d) + ", " + yData(d)); //could use d.xValue, d.yValue
			})
			.on("click", parameterObject.click_url);


		//PATH (LINE CHART) AND CLIP-PATH

		// DEFINE LINE
		var valueline = d3.line()
		    .x(d => xScale(d.xValue))
		    .y(d => yScale(d.yValue));

		//ADD PATHLINE
		svg.append('path')
			.attr("class", "line-path")
			.attr("id", chart_id[k].value)
			.attr("d", valueline(parameterObject.data[k]))
			.attr("stroke", d => colorScale(k))
			.attr("clip-path", "url(#mask)");

		}


		//clip-path: when i scale the x and y axis, you will have data that sits outside the chart in the margins.
		//clip-path is used here to make a rectangle around the graph area so you don't see that...I don't know how anyone could figure this out without stack overflow!
		var mask = svg.append("defs") //https://stackoverflow.com/questions/38051889/d3-js-how-to-clip-area-outside-rectangle-while-zooming-in-a-grouped-bar-chart
			.append("clipPath")
			.attr("id", "mask")
				.append("rect")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", parameterObject.width)
					.attr("height", parameterObject.height);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//appending tooltip: I put this backhere so it renders on top of chart 

var tooltip = svg.append("g")
	.attr("class", "tooltip")
	.style("display", "none");

//formatting tooltip
tooltip.append("text")
    .attr("x", parameterObject.tooltip_x)
    .attr("dx", parameterObject.tooltip_dx)
    .attr("y", parameterObject.tooltip_y)
    .attr("dy", parameterObject.tooltip_dy)
    .style("text-anchor", "middle")
    .attr("font-size", parameterObject.tooltipFontSize)
    .attr("font-weight", "bold");


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//append Standard legend

if (parameterObject.makeLegend == 'yes') {
	var legend = svg.append("g")
	      .attr("font-family", "sans-serif")
	      .attr("font-size", 10)
	    //.attr("text-anchor", "end")
	    .selectAll("g")
	    .data(parameterObject.legendKey)
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	    legend.append("rect")
	      .attr("x", parameterObject.legendRect_x)
	      .attr("y", parameterObject.legendRect_y)
	      .attr("width", parameterObject.legendRect_width)
	      .attr("height", parameterObject.legendRect_height)
	      .attr("fill", colorScale)
	      .on("click", function(d,i){
			// Determine if current line is visible
			var active   = chart_class_return[i].active ? false : true,
			    newOpacity = active ? 0 : 1;
			// Hide or show the elements
			d3.selectAll('.' + chart_class_return[i].value).style("opacity", newOpacity);
			d3.select('#' + chart_id_return[i].value).style("opacity", newOpacity);
			// Update whether or not the elements are active
			chart_class_return[i].active = active;
			});

	    legend.append("text")
	      .attr("x", parameterObject.legendText_x)
	      .attr("dx", parameterObject.legendText_dx)
	      .attr("y", parameterObject.legendText_y)
	      .attr("dy", parameterObject.legendText_dy)
	      .on("mouseover", function(d,i) {
	      	d3.select(this).style("text-decoration", "underline");
	      })
	      .on("mouseout", function(d,i) {
	      	d3.select(this).style("text-decoration", "none");
	      })
	      .on("click", function(d,i){
			// Determine if current line is visible
			var active   = chart_class_return[i].active ? false : true,
			    newOpacity = active ? 0 : 1;
			// Hide or show the elements
			d3.selectAll('.' + chart_class_return[i].value).style("opacity", newOpacity);
			d3.select('#' + chart_id_return[i].value).style("opacity", newOpacity);
			// Update whether or not the elements are active
			chart_class_return[i].active = active;
			})
	      .text(function(d) { return d; });
}

// SPECIAL: create continuous color legend for map plot, written by Mike Bostock, copied and pasted
function continuous(selector_id, colorscale) {
  var legendheight = 1000,
      legendwidth = 80,
      legendMargin = {top: 10, right: 60, bottom: 10, left: 2}
      legend_x_offset = 0;

  var canvas = d3.select(selector_id)
    .style("height", legendheight + "px")
    .style("width", legendwidth + "px")
    .style("position", "relative")
    .append("canvas")
    .attr("height", legendheight - legendMargin.top - legendMargin.bottom)
    .attr("width", 1)
    .style("height", (legendheight - legendMargin.top - legendMargin.bottom) + "px")
    .style("width", (legendwidth - legendMargin.left - legendMargin.right) + "px")
    .style("border", "1px solid #000")
    .style("position", "absolute")
    .style("top", (legendMargin.top) + "px")
    .style("left", (legendMargin.left + legend_x_offset) + "px")
    .node();

  var ctx = canvas.getContext("2d");

  var legendscale = d3.scaleLinear()
    .range([legendheight - legendMargin.top - legendMargin.bottom, 1])
    .domain(colorscale.domain());

  // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
  var image = ctx.createImageData(1, legendheight);
  d3.range(legendheight).forEach(function(i) {
    var c = d3.rgb(colorscale(legendscale.invert(i)));
    image.data[4*i] = c.r;
    image.data[4*i + 1] = c.g;
    image.data[4*i + 2] = c.b;
    image.data[4*i + 3] = 255;
  });
  ctx.putImageData(image, 0, 0);

  var legendaxis = d3.axisRight()
    .scale(legendscale)
    .tickSize(6)
    .ticks(8);

//legend text
  var svg = d3.select(selector_id)
    .append("svg")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", legend_x_offset + "px")
    .style("top", "0px")

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (legendwidth - legendMargin.left - legendMargin.right + 3) + "," + (legendMargin.top) + ")")
    .call(legendaxis);
}

if (parameterObject.continuousLegend == "yes") {
	continuous("#legend", colorScale);
}

}
