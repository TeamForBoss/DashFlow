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

  //  화면 크기 감지 (노트북 크기 체크)
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

    updateSize(); //  최초 실행
    window.addEventListener("resize", updateSize); //  화면 크기 변경 감지

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return; //  초기값 방지

    //  노트북이랑 큰 화면이랑 마진 다르게 설정
    const margin =
      windowWidth <= 1400
        ? { top: 0, right: 0, bottom: 15, left: 0 }
        : { top: 0, right: 0, bottom: 20, left: 0 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    //  기존 그래프 초기화 후 다시 그리기
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xDomain = data.map((d) =>
      windowWidth <= 650 && d.범죄중분류.length > 5
        ? d.범죄중분류.slice(0, 5)
        : d.범죄중분류
    );

    const xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([0, chartWidth])
      .padding(0.5);

    //  작은 화면에서는 yScale의 최대값을 더 크게 설정
    const maxY = d3.max(data, (d) => d.data) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, windowWidth <= 1400 ? maxY * 1.4 : maxY * 1.2]) //  노트북에서 최대값 증가
      .nice()
      .range([chartHeight, 0]);

    //  막대 그래프 그리기
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(xDomain[i])!) //  xDomain과 일치하도록 수정
      .attr("y", chartHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#FF689F")
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.data))
      .attr("height", (d) => chartHeight - yScale(d.data));

    //  막대 위에 숫자 추가 (모바일에서는 폰트 작게 조정)
    const fontSize = windowWidth <= 650 ? "9px" : "13px"; //  반응형 폰트 줄이기
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d, i) => xScale(xDomain[i])! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.data) - (windowWidth <= 1400 ? 5 : 10)) //  노트북에서는 숫자 위치 조정
      .attr("text-anchor", "middle")
      .style("font-size", fontSize)
      .style("fill", "#444")
      .text((d) => d.data)
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr("opacity", 1);

    //  X축 추가 (모바일에서는 폰트 작게 조정)
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-size", fontSize) //  모바일에서 X축 폰트 크기 조정
      .style("fill", "#444");
  }, [data, dimensions, windowWidth]); //  windowWidth가 변경될 때마다 다시 그리기

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
