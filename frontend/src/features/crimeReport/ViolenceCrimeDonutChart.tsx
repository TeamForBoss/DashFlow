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

  //   부모 크기에 맞춰 차트 크기 설정 (반응형 적용)
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize(); // 처음 마운트될 때 크기 설정
    window.addEventListener("resize", updateSize); // 창 크기 변경 감지

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!violenceCrimeData || violenceCrimeData.length === 0) return;

    const { width, height } = dimensions;
    const pieWidth = width * 0.5; //   원을 왼쪽에 배치하기 위해 너비 조정
    const radius = Math.min(pieWidth, height) / 2 - 20;
    const total = d3.sum(violenceCrimeData, (d) => d.data);
    const maxData = Math.max(...violenceCrimeData.map((d) => d.data));

    //   데이터 내림차순 정렬
    const sortedData = [...violenceCrimeData].sort((a, b) => b.data - a.data);

    //   색상 설정
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxData])
      .range(["#FFC0CB", "#FF1493"]);

    const pie = d3.pie<CrimeData>().value((d) => d.data);
    const arc = d3
      .arc<d3.PieArcDatum<CrimeData>>()
      .innerRadius(0)
      .outerRadius(radius);

    //   기존 SVG 내용 삭제 후 새로 그리기
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    //   파이 차트 그룹 (왼쪽 배치)
    const g = svg.append("g").attr(
      "transform",
      `translate(${width / 3}, ${height / 2})` //   왼쪽 정렬
    );

    const arcs = g
      .selectAll(".arc")
      .data(pie(sortedData))
      .enter()
      .append("g")
      .attr("class", "arc");

    //   차트 조각 애니메이션 적용
    arcs
      .append("path")
      .attr("fill", (d) => colorScale(d.data.data))
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

    ///////////////////////////////// 원 데이터 안에 글자 넣기!  !!!!!!///////////////////////
    //  데이터 내림차순 정렬 후 상위 3개 가져오기
    const top3Data = [...violenceCrimeData]
      .sort((a, b) => b.data - a.data)
      .slice(0, 3);
    arcs
      .filter((d) =>
        top3Data.some((item) => item.범죄중분류 === d.data.범죄중분류)
      ) //  TOP 3만 필터링
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`) //   중심 좌표 계산
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff") //   글씨 색
      .style("font-weight", "bold")
      .text((d) => d.data.범죄중분류);
    ///////////////////////////////// 원 데이터 안에 글자 넣기!  !!!!!!///////////////////////

    //   범례 그룹 생성 (오른쪽 & 수직 정렬)
    const legendContainer = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width * 0.7}, ${
          height / 2 - (sortedData.length * 12) / 1.2
        })`
      );
    legendContainer
      .selectAll(".legend-item")
      .data(sortedData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const percent = ((d.data / total) * 100).toFixed(1);

        d3.select(this)
          .append("circle")
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 5)
          .style("fill", colorScale(d.data));

        d3.select(this)
          .append("text")
          .attr("x", 23)
          .attr("y", 14)
          .style("font-size", "12px") // 범례 글씨 크기
          .style("fill", "#333")
          .text(`${d.범죄중분류} - ${percent}%`);
      });
  }, [violenceCrimeData, dimensions]);

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
