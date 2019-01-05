(function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  const yAxisLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const scheme = ["#1c64ae", "#3f92c5", "#90c5df", "#d1e5f1", "#fedbc6", "#f6a57e", "#d85f48", "#b41427"];
  const w = $("#map").width();
  const h = 350;
  const xPadding = 60;
  const yPadding = 20;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onload = () => {
    const json = JSON.parse(xhttp.responseText);
    const baseT = json.baseTemperature;
    const dataset = json.monthlyVariance;

    const xMin = d3.min(dataset, (d) => d.year);
    const xMax = d3.max(dataset, (d) => d.year);

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([xPadding, w - xPadding]);

    const yScale = d3.scaleLinear()
      .domain([0.5, 12.5])
      .range([yPadding, h - yPadding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
    .tickFormat((d,i) => yAxisLabels[i]);

    const map = d3.select("#map")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    map.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month - 0.5))
      .attr("width", (w - 2 * xPadding) / (xMax  -xMin))
      .attr("height", (h - 2 * yPadding) / 12)
      .attr("fill", "red")
      .attr("class", "cell");

    map.append("g")
      .attr("transform", `translate(0, ${h-yPadding})`)
      .call(xAxis);

    map.append("g")
      .attr("transform", `translate(${xPadding}, 0)`)
      .call(yAxis);

    // $("#map").text(JSON.stringify(dataset));
  };
})();