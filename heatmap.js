const yAxisLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

(function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  const scheme = ["#1c64ae", "#3f92c5", "#90c5df", "#d1e5f1", "#fedbc6", "#f6a57e", "#d85f48", "#b41427"];
  const padding = {
    t: 30,
    r: 10,
    b: 20,
    l: 60
  };
  const w = $("#map").width();
  const h = 400;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onload = () => {
    const json = JSON.parse(xhttp.responseText);
    const tBase = json.baseTemperature;
    const dataset = json.monthlyVariance;

    const xMin = d3.min(dataset, (d) => d.year);
    const xMax = d3.max(dataset, (d) => d.year);
    const yMin = d3.min(dataset, (d) => d.month);
    const yMax = d3.max(dataset, (d) => d.month);
    const vMin = d3.min(dataset, (d) => d.variance);
    const vMax = d3.max(dataset, (d) => d.variance);

    const cScale = d3.scaleLinear()
      .domain([vMin, vMax])
      .range([0, scheme.length - 1]);

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([padding.l, w - padding.r]);

    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([padding.t, h - padding.b]);

    const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d, i) => yAxisLabels[i]);

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
      .attr("width", (w - padding.l - padding.r) / (xMax - xMin))
      .attr("height", (h - padding.t - padding.b) / 12)
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.variance + tBase)
      .attr("class", "cell")
      .attr("onmouseover", "tooltip(this)")
      .attr("onmouseout", "$('#tooltip').hide()")
      .attr("fill", (d) =>
        scheme[Math.floor(cScale(d.variance))]
      );

    map.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h-padding.b})`)
      .call(xAxis);

    map.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding.l}, 0)`)
      .call(yAxis);

    // I added the legend element in a separate SVG
    const cell = 25;
    let ticks = [vMin + tBase,];
    const interval = (vMax - vMin) / scheme.length;
    scheme.forEach(function(v,i) {
      const val = (vMin + tBase) + (i + 1) * interval;
      ticks.push(val);
    });
    const lScale = d3.scaleLinear()
      .domain([vMin + tBase, vMax + tBase])
      .range([
        (w / 2) - (scheme.length / 2) * cell,
        (w / 2) + (scheme.length / 2) * cell
      ]);

    const lAxis = d3.axisBottom(lScale)
    .tickValues(ticks)
    .tickFormat(d3.format(".1f"));

    const legend = d3.select("#legend")
      .append("svg")
      .attr("width", w)
      .attr("height", cell + 20);

    legend.selectAll("rect")
      .data(scheme)
      .enter()
      .append("rect")
      .attr("x", (d, i) =>
        (w / 2) + i * cell - (scheme.length / 2) * cell
      ).attr("y", 0)
      .attr("width", cell)
      .attr("height", cell)
      .attr("fill", (d) => d);

    legend.append("g")
      .attr("transform", `translate(0, ${cell})`)
      .call(lAxis);

  };
})();

function tooltip(rect) {
  const e = $(rect);
  const t = parseFloat(e.attr("data-temp"));
  const x = parseInt(e.attr("x")) + 40 + "px";
  const y = e.attr("y") + "px";
  const month = parseInt(e.attr("data-month")) - 1;

  $("#month").text(yAxisLabels[month]);
  $("#year").text(e.attr("data-year"));
  $("#temp").text("Temp: " + t.toFixed(2) + " °C");
  $("#tooltip").show().css("left", x).css("top", y)
    .attr("data-year", e.attr("data-year"));
}