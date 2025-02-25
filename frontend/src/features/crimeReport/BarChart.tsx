import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface CrimeData {
  범죄중분류: string;
  data: number;
}

interface BarChartProps {
  data: CrimeData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
      setWindowWidth(window.innerWidth);
    };

    updateSize(); // ✅ 최초 실행
    window.addEventListener("resize", updateSize); // ✅ 화면 크기 변경 감지

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const filteredData =
      windowWidth <= 650
        ? [...data].sort((a, b) => b.data - a.data).slice(0, 5)
        : data;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const margin =
      windowWidth <= 1400
        ? { top: 0, right: 0, bottom: 20, left: 0 }
        : { top: 0, right: 0, bottom: 25, left: 0 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ✅ 모든 환경에서 글자 5개로 제한
    const xDomain = filteredData.map((d) => d.범죄중분류.slice(0, 5));

    const xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([0, chartWidth])
      .padding(0.5);

    const maxY = d3.max(filteredData, (d) => d.data) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, windowWidth <= 1400 ? maxY * 1.4 : maxY * 1.2])
      .nice()
      .range([chartHeight, 0]);

    svg
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(xDomain[i])!)
      .attr("y", chartHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#FF689F")
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.data))
      .attr("height", (d) => chartHeight - yScale(d.data));

    const fontSize = windowWidth <= 650 ? "12px" : "12px";
    svg
      .selectAll(".label")
      .data(filteredData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d, i) => xScale(xDomain[i])! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.data) - (windowWidth <= 1400 ? 5 : 10))
      .attr("text-anchor", "middle")
      .style("font-size", fontSize)
      .style("fill", "#444")
      .text((d) => d.data)
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr("opacity", 1);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-size", fontSize)
      .style("fill", "#333")
      .attr("dy", "1em");
  }, [data, dimensions, windowWidth]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
