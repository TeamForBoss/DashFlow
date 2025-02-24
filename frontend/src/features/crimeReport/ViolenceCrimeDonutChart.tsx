import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useCrimeData from "../../features/crimeReport/useCrimeData";

interface CrimeData {
  범죄중분류: string;
  data: number;
}

interface ViolenceCrimePieChartProps {
  width?: number;
  height?: number;
}

const ViolenceCrimePieChart: React.FC<ViolenceCrimePieChartProps> = ({
  width = 320, // 차트 가로 크기
  height = 320, // 차트 세로 크기
}) => {
  const { violenceCrimeData } = useCrimeData();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!violenceCrimeData || violenceCrimeData.length === 0) return;

    const pieWidth = width * 0.6; // 차트의 실제 너비
    const radius = Math.min(pieWidth, height) / 2 - 20; // 원형 차트의 반지름
    const total = d3.sum(violenceCrimeData, (d) => d.data); // 전체 데이터 합계
    const maxData = Math.max(...violenceCrimeData.map((d) => d.data)); // 최대값 구하기

    // ✅ 데이터 내림차순 정렬 (가장 큰 값이 맨 위에 오도록!)
    const sortedData = [...violenceCrimeData].sort((a, b) => b.data - a.data);

    // ✅ 색상 설정 (데이터 크기에 따라 색상 변경)
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxData])
      .range(["#FFC0CB", "#FF1493"]); // 원하는 색상으로 변경 가능

    // ✅ D3 파이 차트 설정
    const pie = d3.pie<CrimeData>().value((d) => d.data);
    const arc = d3
      .arc<d3.PieArcDatum<CrimeData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + 100) // 전체 SVG 크기 설정
      .attr("height", height);

    // ✅ 차트 위치 조정 (오른쪽으로 20px, 위로 60px 이동)
    const g = svg
      .append("g")
      .attr("transform", `translate(${pieWidth / 2 + 20}, ${height / 2 - 60})`);

    const arcs = g
      .selectAll(".arc")
      .data(pie(sortedData)) // ✅ 내림차순 정렬된 데이터 적용!
      .enter()
      .append("g")
      .attr("class", "arc");

    // ✅ 차트 조각(파이) 생성 및 애니메이션 적용
    arcs
      .append("path")
      .attr("fill", (d) => colorScale(d.data.data)) // 데이터 크기에 따른 색상 설정
      .style("stroke", "#fff") // 테두리 색상
      .style("stroke-width", "2px")
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) as string;
        };
      });

    // ✅ 범례 위치 조정 (오른쪽으로 80px, 위로 60px 이동)
    const legend = svg
      .append("g")
      .attr("transform", `translate(${pieWidth + 80}, ${height / 4 - 60})`);

    // ✅ 범례 추가 (퍼센트 포함 + 내림차순 정렬)
    legend
      .selectAll(".legend-item")
      .data(sortedData) // ✅ 내림차순 정렬된 데이터 적용!
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const percent = ((d.data / total) * 100).toFixed(1); // ✅ 퍼센트 계산

        d3.select(this)
          .append("circle")
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 5)
          .style("fill", colorScale(d.data)); // 범례 색상

        d3.select(this)
          .append("text")
          .attr("x", 22)
          .attr("y", 14)
          .style("font-size", "10px")
          .style("fill", "#333")
          .text(`${d.범죄중분류} - ${percent}%`); // ✅ 범례에 퍼센트 포함!
      });
  }, [violenceCrimeData, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default ViolenceCrimePieChart;
