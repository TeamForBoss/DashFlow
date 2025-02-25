import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface CrimeData {
  범죄중분류: string;
  data: number;
}

interface LineChartProps {
  data1: CrimeData[];
  data2: CrimeData[];
}

const IntelligenceCrimeLineChart: React.FC<LineChartProps> = ({
  data1,
  data2,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ 화면 크기 감지 (14인치 이하에서 margin 수정)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      !data1 ||
      data1.length === 0 ||
      !data2 ||
      data2.length === 0 ||
      !containerRef.current
    )
      return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const width = containerWidth;
    const height = containerHeight;

    // ✅ 반응형 margin 설정
    const margin =
      windowWidth <= 1400
        ? { top: 0, right: 150, bottom: 35, left: 20 } // 노트북
        : { top: 20, right: 20, bottom: 40, left: 20 }; // 일반 화면

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scalePoint()
      .domain(data1.map((crime) => crime.범죄중분류))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const maxY = Math.max(
      d3.max(data1, (d) => d.data) || 0,
      d3.max(data2, (d) => d.data) || 0
    );

    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height - margin.top - margin.bottom, 20]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ✅ 선 생성 함수
    const createLine = (
      data: CrimeData[],
      color: string,
      labelPosition: "top" | "bottom"
    ) => {
      const line = d3
        .line<CrimeData>()
        .x((d) => xScale(d.범죄중분류)!)
        .y((d) => yScale(d.data))
        .curve(d3.curveMonotoneX);

      const path = chartGroup
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // ✅ 동그라미 추가 (데이터 포인트)
      chartGroup
        .selectAll(`.dot-${color}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `dot-${color}`)
        .attr("cx", (d) => xScale(d.범죄중분류)!)
        .attr("cy", (d) => yScale(d.data))
        .attr("r", 4)
        .attr("fill", color)
        .attr("opacity", 0)
        .transition()
        .delay((_, i) => i * 100)
        .duration(500)
        .attr("opacity", 1);

      // ✅ 숫자 추가 (labelPosition에 따라 위/아래 구분)
      chartGroup
        .selectAll(`.label-${color}`)
        .data(data)
        .enter()
        .append("text")
        .attr("class", `label-${color}`)
        .attr("x", (d) => xScale(d.범죄중분류)!)
        .attr("y", (d) => {
          return labelPosition === "top"
            ? yScale(d.data) - 10
            : yScale(d.data) + 15;
        })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#333")
        .style("font-weight", "bold")
        .attr("opacity", 0)
        .text((d) => d.data)
        .transition()
        .delay((_, i) => i * 100)
        .duration(500)
        .attr("opacity", 1);
    };

    // ✅ 두 개의 선 추가 (겹쳐서 그리기 + 숫자 위/아래 구분)
    createLine(data1, "#FF1493", "top"); // 첫 번째 데이터 (진한 핑크, 숫자 위)
    createLine(data2, "#FFA500", "bottom"); // 두 번째 데이터 (오렌지, 숫자 아래)

    // ✅ X축 추가 (눈금 제거)
    chartGroup
      .append("g")
      .attr(
        "transform",
        `translate(0, ${height - margin.top - margin.bottom + 20})`
      )
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#333");

    // ✅ Y축 제거 (검은색 선 삭제)
    chartGroup.selectAll("g .domain").remove();

    // ✅ 범례 추가
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 110}, 10)`);

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .style("fill", "#FF1493");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 14)
      .text("해당 지역")
      .style("font-size", "12px");

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 30)
      .attr("r", 5)
      .style("fill", "#FFA500");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 34)
      .text("경기도 평균")
      .style("font-size", "12px");
  }, [data1, data2, windowWidth]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntelligenceCrimeLineChart;
