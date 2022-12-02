var margin = ({top: 10, right: 20, bottom: 50, left: 105});
var members = Array.from(new Set(combinedData.map(d => d.memberType)));
var memberColor = d3.scaleOrdinal().domain(members).range(d3.schemeCategory10);
var visHeight = 400;
var visWidth = 400;
var zipCodesArr = Array.from(new Set(combinedDataZip.map(d => d.zipCode)));

var x = d3.scaleLinear()
      .domain(d3.extent(combinedData, d => parseInt(d.hour))).nice()
      .range([0, 400])

var y = d3.scaleLinear()
      .domain(d3.extent(combinedData, d => d.meanTime)).nice()
      .range([400, 0])

var xAxis = (g, scale, label) =>
  g.attr('transform', `translate(0, ${400})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('y1', -400)
          .attr('y2', 0))
    // add label
    .append('text')
      .attr('x', 400 / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)

var yAxis = (g, scale, label) => 
// add axis
g.call(d3.axisLeft(scale))
    // remove baseline
    .call(g => g.select('.domain').remove())
    // add grid lines
    // refernces https://observablehq.com/@d3/connected-scatterplot
    .call(g => g.selectAll('.tick line')
      .clone()
        .attr('stroke', '#d3d3d3')
        .attr('x1', 0)
        .attr('x2', 400))
  // add label
  .append('text')
    .attr('x', -40)
    .attr('y', 400 / 2)
    .attr('fill', 'black')
    .attr('dominant-baseline', 'middle')
    .text(label)

var zipColor = d3.scaleOrdinal().domain(zipCodesArr).range(d3.schemeCategory10);

var xZip = d3.scaleLinear()
    .domain(d3.extent(combinedDataZip, d => parseInt(d.hour))).nice()
    .range([0, visWidth])
var yZip = d3.scaleLinear()
  .domain(d3.extent(combinedDataZip, d => d.meanTime)).nice()
  .range([visHeight, 0])

var xAxisZip = (g, scale, label) =>
  g.attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('y1', -visHeight)
          .attr('y2', 0))
    // add label
    .append('text')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)


var yAxisZip = (g, scale, label) => 
// add axis
g.call(d3.axisLeft(scale))
    // remove baseline
    .call(g => g.select('.domain').remove())
    // add grid lines
    // refernces https://observablehq.com/@d3/connected-scatterplot
    .call(g => g.selectAll('.tick line')
      .clone()
        .attr('stroke', '#d3d3d3')
        .attr('x1', 0)
        .attr('x2', visWidth))
  // add label
  .append('text')
    .attr('x', -40)
    .attr('y', visHeight / 2)
    .attr('fill', 'black')
    .attr('dominant-baseline', 'middle')
    .text(label)


function LineChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    defined, // for gaps in data
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    zDomain, // array of z-values
    colors = ["blue", "orange"], // stroke color of line, as a constant or a function of *z*
    strokeLinecap, // stroke line cap of line
    strokeLinejoin, // stroke line join of line
    strokeWidth = 1.5, // stroke width of line
    strokeOpacity, // stroke opacity of line
    mixBlendMode = "multiply", // blend mode of lines
  } = {}) {

    for(let i = 0; i < data.length; i++) {
        data[i].value = new Date(data[i].value);
    }
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);
    const O = d3.map(data, d => d);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

  
    // Compute default domains, and unique the z-domain.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
    if (zDomain === undefined) zDomain = Z;
    zDomain = new d3.InternSet(zDomain);
  
    // Omit any data not present in the z-domain.
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);
  
    // Compute titles.
    const T = title === undefined ? Y : title === null ? null : d3.map(data, title);

    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));
    
  
    const svg = d3.select("#plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .style("-webkit-tap-highlight-color", "transparent")
        .on("pointerenter", pointerentered)
        .on("pointermove", pointermoved)
        .on("pointerleave", pointerleft)
        .on("touchstart", event => event.preventDefault());
  
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    const path = svg.append("g")
        .attr("fill", "none")
        //.attr("stroke", typeof color === "string" ? color : null)
        .attr("stroke",  (d, i) => colors[i])
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
      .selectAll("path")
      .data(d3.group(I, i => Z[i]))
      .join("path")
        .style("mix-blend-mode", mixBlendMode)
        // .attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
        .attr("stroke", (d, i) => colors[i])
        .attr("d", ([, I]) => line(I));


  
    const dot = svg.append("g")
        .attr("display", "none");
  
    dot.append("circle")
        .attr("r", 2.5);
  
    dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);
  
    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event);
      const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
      path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
      dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
      if (T) dot.select("text").text(T[i]);
      svg.property("value", O[i]).dispatch("input", {bubbles: true});
    }
  
    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd");
      dot.attr("display", null);
    }
  
    function pointerleft() {
      path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
      dot.attr("display", "none");
      svg.node().value = null;
      svg.dispatch("input", {bubbles: true});
    }
  
    svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "blue")
    svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "orange")
    svg.append("text").attr("x", 220).attr("y", 130).text("member").style("font-size",    "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 220).attr("y", 160).text("casual").style("font-size", "15px").attr("alignment-baseline","middle")
  
   // return Object.assign(svg.node(), {value: null});
  }
  


  function brushableScatterplot() {
    // set up
  
    // the value for when there is no brush
    const initialValue = combinedData;
  
    const svg = d3.select("#scatterInteractable")
        .append("svg")
        .attr('width', 400 + margin.left + margin.right)
        .attr('height', 400 + margin.top + margin.bottom)
        .property('value', initialValue)
  
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // axes
    g.append("g").call(xAxis, x, 'Time of Day');
    g.append("g").call(yAxis, y, 'Time Trip Took');
    
    // draw points
    
    const radius = 3;
    
    const dots = g.selectAll('circle')
      .data(combinedData)
      .join('circle')
        .attr('cx', d => x(parseInt(d.hour)))
        .attr('cy', d => y(d.meanTime))
        .attr('fill', d =>  memberColor(d.memberType))
        .attr('opacity', 1)
        .attr('r', radius);
    
    // ********** brushing here **********
    
    const brush = d3.brush()
        // set the space that the brush can take up
        .extent([[0, 0], [400, 400]])
        // handle events
        .on('brush', onBrush)
        .on('end', onEnd);
    
    g.append('g')
        .call(brush);
    
    function onBrush(event) {
      // event.selection gives us the coordinates of the
      // top left and bottom right of the brush box
      const [[x1, y1], [x2, y2]] = event.selection;
      
      // return true if the dot is in the brush box, false otherwise
      function isBrushed(d) {
        const cx = x(parseInt(d.hour));
        const cy = y(d.meanTime)
        return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
      } 
      
      // style the dots
      dots.attr('fill', d => isBrushed(d) ? memberColor(d.memberType) : 'gray');
      
      // update the data that appears in the cars variable
      svg.property('value', combinedData.filter(isBrushed)).dispatch('input');
    }
    
    function onEnd(event) {
      // if the brush is cleared
      if (event.selection === null) {
        // reset the color of all of the dots
        dots.attr('fill', d => memberColor(d.memberType));
        svg.property('value', initialValue).dispatch('input');
      }
    }
  
    return svg.node();
  }

  function barChartMembers() {
    const svg = d3.select("#scatterInteractable")
        .append('svg')
        .attr('width', 400 + margin.left + margin.right)
        .attr('height', 400 + margin.top + margin.bottom);
  
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // create scales
    
    const x = d3.scaleLinear()
        .range([0, 400]);
    
    const y = d3.scaleBand()
        .domain(memberColor.domain())
        .range([0, 400])
        .padding(0.2);
    
    // create and add axes
    
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    
    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0, ${400})`);
    
    xAxisGroup.append("text")
        .attr("x", 400 / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Count");
    
    const yAxis = d3.axisLeft(y);
    
    const yAxisGroup = g.append("g")
        .call(yAxis)
        // remove baseline from the axis
        .call(g => g.select(".domain").remove());
      
    let barsGroup = g.append("g");
  
    function update(data) {
      
      // get the number of tripes for each zipCode
      const memberCount = d3.rollup(
        data,
        // group => group.length,
        group => d3.sum(group, d => d.count),
        d => d.memberType
      );
  
      // update x scale
      x.domain([0, d3.max(memberCount.values())]).nice()
  
      // update x axis
  
      const t = svg.transition()
          .ease(d3.easeLinear)
          .duration(200);
  
      xAxisGroup
        .transition(t)
        .call(xAxis);
      
      // draw bars
      barsGroup.selectAll("rect")
        .data(memberCount, ([membersNum, count]) => membersNum)
        .join("rect")
          .attr("fill", ([membersNum, count]) => memberColor(membersNum))
          .attr("height", y.bandwidth())
          .attr("x", 0)
          .attr("y", ([membersNum, count]) => y(membersNum))
        .transition(t)
          .attr("width", ([membersNum, count]) => x(count))
    }
    
    return Object.assign(svg.node(), { update });;
  }

  function zipbrushableScatterplot() {
    // set up
  
    // the value for when there is no brush
    const initialValue = combinedDataZip;
  
    const svg = d3.select("#plot2")
        .append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom)
        .property('value', initialValue)
  
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // axes
    g.append("g").call(xAxisZip, xZip, 'Time of Day');
    g.append("g").call(yAxisZip, yZip, 'Time Trip Took');
    
    // draw points
    
    const radius = 3;
    
    const dots = g.selectAll('circle')
      .data(combinedDataZip)
      .join('circle')
        .attr('cx', d => xZip(parseInt(d.hour)))
        .attr('cy', d => yZip(d.meanTime))
        .attr('fill', d =>  zipColor(d.zipCode))
        .attr('opacity', 1)
        .attr('r', radius);
    
    // ********** brushing here **********
    
    const brush = d3.brush()
        // set the space that the brush can take up
        .extent([[0, 0], [visWidth, visHeight]])
        // handle events
        .on('brush', onBrush)
        .on('end', onEnd);
    
    g.append('g')
        .call(brush);
    
    function onBrush(event) {
      // event.selection gives us the coordinates of the
      // top left and bottom right of the brush box
      const [[x1, y1], [x2, y2]] = event.selection;
      
      // return true if the dot is in the brush box, false otherwise
      function isBrushed(d) {
        const cx = xZip(parseInt(d.hour));
        const cy = yZip(d.meanTime)
        return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
      } 
      
      // style the dots
      dots.attr('fill', d => isBrushed(d) ? zipColor(d.zipCode) : 'gray');
      
      // update the data that appears in the cars variable
      svg.property('value', combinedDataZip.filter(isBrushed)).dispatch('input');
    }
    
    function onEnd(event) {
      // if the brush is cleared
      if (event.selection === null) {
        // reset the color of all of the dots
        dots.attr('fill', d => zipColor(d.zipCode));
        svg.property('value', initialValue).dispatch('input');
      }
    }
    console.log(svg.node());

    return svg.node();
  }

  function barChartZip() {
    const svg = d3.select('#plot2')
        .append("svg")
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom);
  
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // create scales
    
    const x = d3.scaleLinear()
        .range([0, visWidth]);
    
    const y = d3.scaleBand()
        .domain(zipColor.domain())
        .range([0, visHeight])
        .padding(0.2);
    
    // create and add axes
    
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    
    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0, ${visHeight})`);
    
    xAxisGroup.append("text")
        .attr("x", visWidth / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Count");
    
    const yAxis = d3.axisLeft(y);
    
    const yAxisGroup = g.append("g")
        .call(yAxis)
        // remove baseline from the axis
        .call(g => g.select(".domain").remove());
      
    let barsGroup = g.append("g");
  
    function update(data) {
      
      // get the number of tripes for each zipCode
      const zipCount = d3.rollup(
        data,
        // group => group.length,
        group => d3.sum(group, d => d.count),
        d => d.zipCode
      );
  
      // update x scale
      x.domain([0, d3.max(zipCount.values())]).nice()
  
      // update x axis
  
      const t = svg.transition()
          .ease(d3.easeLinear)
          .duration(200);
  
      xAxisGroup
        .transition(t)
        .call(xAxis);
      
      // draw bars
      barsGroup.selectAll("rect")
        .data(zipCount, ([zipNum, count]) => zipNum)
        .join("rect")
          .attr("fill", ([zipNum, count]) => zipColor(zipNum))
          .attr("height", y.bandwidth())
          .attr("x", 0)
          .attr("y", ([zipNum, count]) => y(zipNum))
        .transition(t)
          .attr("width", ([zipNum, count]) => x(count))
    }
    console.log(svg.node());
    return Object.assign(svg.node(), { update });;
  }

  
function init(){


    const chart = LineChart(e, {
        x: d => d.value,
        y: d => d.m,
        z: d => d.key,
        yLabel: "Time Trip Took From Start to End Station",
        width: 500,
        height: 500,
      })

      const scatter = brushableScatterplot();
      const barM = barChartMembers();
    
      // update the bar chart when the scatterplot
      // selection changes
      d3.select(scatter).on('input', () => {
        barM.update(scatter.value);
      });
  
      // intial state of bar chart
      barM.update(scatter.value);
      
    
    // use HTML to place the two charts next to each other
     //return html`<div style="display: flex">${scatter}${barM}</div>`;
    
     //  focus = Generators.input(chart)


    //   const scatter2 = zipbrushableScatterplot();
    //   const barM2 = barChartZip();

    //   // update the bar chart when the scatterplot
    //   // selection changes
    //   d3.select(scatter2).on('input', () => {
    //     barM2.update(scatter2.value);
    //   });

    //   // intial state of bar chart
    //   barM2.update(scatter2.value);

      // use HTML to place the two charts next to each other
     // return html`<div style="display: flex">${scatter}${barM}</div>`;
}

window.onload = init;