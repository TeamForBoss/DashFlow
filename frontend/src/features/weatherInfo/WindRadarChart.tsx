import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const WindRadarChart = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      const parent = d3.select(svgRef.current).node()?.parentElement;
      if (parent) {
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!data) return;
    const windInfo = Array.isArray(data) ? data[0] : data;

    d3.select(svgRef.current).selectAll("*").remove();

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "hidden");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.append("line")
      .attr("x1", -radius)
      .attr("y1", 0)
      .attr("x2", radius)
      .attr("y2", 0)
      .attr("stroke", "#333")
      .attr("stroke-dasharray", "3,3");

    g.append("line")
      .attr("x1", 0)
      .attr("y1", -radius)
      .attr("x2", 0)
      .attr("y2", radius)
      .attr("stroke", "#333")
      .attr("stroke-dasharray", "3,3");

    const directions = [
      { x: 0, y: -radius - 10, text: "북" },
      { x: radius + 10, y: 5, text: "동" },
      { x: 0, y: radius + 20, text: "남" },
      { x: -radius - 10, y: 5, text: "서" },
    ];

    g.selectAll(".direction-text")
      .data(directions)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#444")
      .text(d => d.text);

    const windSpeed = windInfo.wind.speed;
    const windDeg = windInfo.wind.deg;

    const angleScale = d3.scaleLinear().domain([0, 360]).range([0, 2 * Math.PI]);
    const speedScale = d3.scaleLinear().domain([0, windSpeed]).range([0, radius]);

    const gridSteps = d3.range(0, windSpeed + 1, Math.max(windSpeed / 3, 0.5));
    g.selectAll(".grid-line")
      .data(gridSteps)
      .enter()
      .append("circle")
      .attr("class", "grid-line")
      .attr("r", d => speedScale(d))
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-dasharray", "3,3");

    const xOuter = radius * Math.cos(angleScale(windDeg) - Math.PI / 2);
    const yOuter = radius * Math.sin(angleScale(windDeg) - Math.PI / 2);

    g.append("line")
      .attr("x1", xOuter)
      .attr("y1", yOuter)
      .attr("x2", -xOuter)
      .attr("y2", -yOuter)
      .attr("stroke", "#2E7D32")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrow)");

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#2E7D32");

    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 24)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("fill", "#222")
      .text(`${windSpeed} m/s, ${windDeg}°`);
  }, [data, dimensions]);

  return (
    <div style={{ width: "100%", height: "98%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WindRadarChart;