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

  //   화면 크기 감지 후 dimensions 상태 업데이트
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize(); //   최초 실행
    window.addEventListener("resize", updateSize); //   화면 크기 변경 감지

    return () => window.removeEventListener("resize", updateSize); //   언마운트 시 리스너 제거
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return; //   초기값 방지

    const margin = { top: 0, right: 0, bottom: 20, left: 0 }; //   top 여백 추가
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    //   기존 그래프 초기화 후 다시 그리기
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.범죄중분류))
      .range([0, chartWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.data) || 0) * 1.1]) //   최대값을 10% 증가
      .nice()
      .range([chartHeight, 0]);

    //   막대 그래프 그리기
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.범죄중분류)!)
      .attr("y", chartHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#FF689F")
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.data))
      .attr("height", (d) => chartHeight - yScale(d.data));

    //   막대 위에 숫자 추가 (위쪽 여백 추가)
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.범죄중분류)! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.data) - 10) //   숫자를 좀 더 아래로 이동
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#555")
      .text((d) => d.data)
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr("opacity", 1);

    //   X축 추가
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#444");
  }, [data, dimensions]); //   dimensions가 변경될 때마다 다시 그리기

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
