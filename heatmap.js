(function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  const yAxisLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

    const xScale = d3.scaleLinear()
      .domain([
        d3.min(dataset, (d) => d.year),
        d3.max(dataset, (d) => d.year)
      ])
      .range([xPadding, w]);

    const yScale = d3.scaleLinear()
      .domain([1, 12]).range([yPadding, h - yPadding]);

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
      .attr("width", 0)
      .attr("class", "cell");

    map.append("g")
      .attr("transform", `translate(0, ${h-yPadding})`)
      .call(xAxis);

    map.append("g")
      .attr("transform", `translate(${xPadding}, 0)`)
      .call(yAxis);

    //$("#map").text(JSON.stringify(dataset));
  };
})();