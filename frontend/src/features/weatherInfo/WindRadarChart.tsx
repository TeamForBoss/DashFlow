import { useEffect, useRef } from "react";
import * as d3 from "d3";

const WindRadarChart = ({ data }: { data: any }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data) return;
    const windInfo = Array.isArray(data) ? data[0] : data;

    // 기존 내용 초기화
    d3.select(svgRef.current).selectAll("*").remove();

    const parent = d3.select(svgRef.current).node()?.parentElement as HTMLElement;
    const width = parent?.clientWidth || 400;
    const height = parent?.clientHeight || 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "hidden");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 중앙 기준의 수평, 수직 선
    g.append("line")
      .attr("x1", -radius)
      .attr("y1", 0)
      .attr("x2", radius)
      .attr("y2", 0)
      .attr("stroke", "#aaa")
      .attr("stroke-dasharray", "2,2");

    g.append("line")
      .attr("x1", 0)
      .attr("y1", -radius)
      .attr("x2", 0)
      .attr("y2", radius)
      .attr("stroke", "#aaa")
      .attr("stroke-dasharray", "2,2");

    // 동서남북 텍스트
    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("북");

    g.append("text")
      .attr("x", radius + 10)
      .attr("y", 5)
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("동");

    g.append("text")
      .attr("x", 0)
      .attr("y", radius + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("남");

    g.append("text")
      .attr("x", -radius - 10)
      .attr("y", 5)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("서");

    const windSpeed = windInfo.wind.speed;
    const windDeg = windInfo.wind.deg;

    const angleScale = d3.scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI]);

    const speedScale = d3.scaleLinear()
      .domain([0, windSpeed])
      .range([0, radius]);

    // 내부 그리드 원
    const gridSteps = d3.range(0, windSpeed + 1, Math.max(windSpeed / 3, 0.5));
    g.selectAll(".grid-line")
      .data(gridSteps)
      .enter()
      .append("circle")
      .attr("class", "grid-line")
      .attr("r", d => speedScale(d))
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "3,3");

    // 바람의 방향을 나타내는 화살표  
    // (원점이 아닌, 바깥쪽에서 중심으로 선을 그림)
    const xOuter = speedScale(windSpeed) * Math.cos(angleScale(windDeg) - Math.PI / 2);
    const yOuter = speedScale(windSpeed) * Math.sin(angleScale(windDeg) - Math.PI / 2);

    g.append("line")
      .attr("x1", xOuter)
      .attr("y1", yOuter)
      .attr("x2", 0)
      .attr("y2", 0)
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 6)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#4CAF50");

    // 바람 속도와 방향 텍스트
    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text(`${windSpeed} m/s, ${windDeg}°`);

  }, [data]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WindRadarChart;
