import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const margin = { top: 30, right: -10, bottom: 10, left: -10 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.범죄중분류))
      .range([margin.left, width - margin.right])
      .padding(0.8); // 그래프 패딩임!

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.data) || 0])
      .range([height, margin.top]);

    // svg
    //   .append("g")
    //   .attr("class", "axis y-axis")
    //   .attr("transform", `translate(${margin.left}, 0)`)
    //   .call(d3.axisLeft(yScale).ticks(5)); // 여기서 ticks(5)는 눈금 수를 설정해줘

    svg.selectAll(".bar").remove();
    svg.selectAll(".axis").remove();
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.범죄중분류)!)
      .attr("y", height) // 초기 위치를 맨 아래로 설정
      .attr("width", xScale.bandwidth())
      .attr("height", 0) // 처음에는 안 보이게
      .attr("fill", "#FF689F")
      .transition()
      .duration(2000)
      .attr("y", (d) => yScale(d.data))
      .attr("height", (d) => height - yScale(d.data));

    // 데이터 숫자를 막대 위에 추가
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.범죄중분류)! + xScale.bandwidth() / 2) // 막대 중앙에 위치
      .attr("y", (d) => yScale(d.data) - 5) // 막대 위에 위치
      .attr("text-anchor", "middle") // 텍스트 중앙 정렬
      .text((d) => d.data); // 데이터 값 표시

    svg
      // 범죄 데이터 글자 넣기!!
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("fill", "#333")
      .attr("text-anchor", "middle");

    //   .attr("transform", "rotate(-45)")
    //   .style("text-anchor", "end");

    // svg
    //   .append("g")
    //   .attr("class", "axis y-axis")
    //   .attr("transform", `translate(${margin.left}, 0)`)
    //   .call(d3.axisLeft(yScale));

    // 창 크기 변경 시 그래프 다시 그리기
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        svg.attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
