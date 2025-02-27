import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useCrimeData from "../../features/crimeReport/useCrimeData";

interface CrimeData {
  범죄중분류: string;
  data: number;
}

const ViolenceCrimePieChart: React.FC = () => {
  const { violenceCrimeData } = useCrimeData();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    handleResize(); // 최초 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!violenceCrimeData || violenceCrimeData.length === 0) return;

    const { width, height } = dimensions;
    const pieWidth = width * 0.5;
    const radius = Math.min(pieWidth, height) / 2 - 20;
    const total = d3.sum(violenceCrimeData, (d) => d.data);

    // 데이터 내림차순 정렬 후 상위 6개 선택
    const sortedData = [...violenceCrimeData].sort((a, b) => b.data - a.data);
    const limitedData = sortedData.slice(0, 6);

    //  더 다양한 핑크 & 퍼플 계열 색상 적용
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(limitedData.map((d) => d.범죄중분류))
      .range([
        "#FF99CC",
        "#FF66B2",
        "#FF3385",
        "#CC66FF",
        "#9933FF",
        "#CC99FF",
      ]);

    const pie = d3.pie<CrimeData>().value((d) => d.data);
    const arc = d3
      .arc<d3.PieArcDatum<CrimeData>>()
      .innerRadius(radius * 0.6) //  도넛 차트로 변경
      .outerRadius(radius);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    //  모바일과 컴퓨터에서 위치 다르게 설정
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${windowWidth > 650 ? width / 2.8 : width / 4}, ${
          height / 2
        })`
      );

    const arcs = g
      .selectAll(".arc")
      .data(pie(limitedData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("fill", (d) => colorScale(d.data.범죄중분류))
      .style("stroke", "#fff")
      .style("stroke-width", "2px")
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) as string;
        };
      });

    // 원 안에 들어갈 텍스트 (내림차순 상위 2개)
    const topData = limitedData.slice(0, 3);

    arcs
      .filter((d) =>
        topData.some((item) => item.범죄중분류 === d.data.범죄중분류)
      )
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .style("font-weight", "bold")
      .text((d) => d.data.범죄중분류);

    // 범례 위치 수직 중앙 정렬
    const legendX = windowWidth > 650 ? width * 0.65 : width * 0.5;
    const legendY = height / 2 - limitedData.length * 10;

    const legendContainer = svg
      .append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    //  범례 색상을 도넛 차트 색상과 정확히 일치하도록 수정
    legendContainer
      .selectAll(".legend-item")
      .data(limitedData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const percent = ((d.data / total) * 100).toFixed(1);
        const color = colorScale(d.범죄중분류); //  도넛과 동일한 색 가져오기

        d3.select(this)
          .append("circle")
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 6)
          .style("fill", color); //  도넛과 동일한 색 적용

        d3.select(this)
          .append("text")
          .attr("x", 23)
          .attr("y", 14)
          .style("font-size", "13px")
          .style("fill", "#333")
          .text(`${d.범죄중분류} ${d.data}건 - ${percent}%`);
      });
  }, [violenceCrimeData, dimensions, windowWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ViolenceCrimePieChart;
