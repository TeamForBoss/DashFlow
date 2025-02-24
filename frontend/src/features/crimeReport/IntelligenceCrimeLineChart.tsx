import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface CrimeData {
  범죄중분류: string;
  data: number;
}

interface LineChartProps {
  data: CrimeData[];
}

const IntelligenceCrimeLineChart: React.FC<LineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    // console.log(data);

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const width = containerWidth - 20;
    const height = containerHeight - 20;
    const margin = { top: 10, right: 20, bottom: 85, left: 20 };
    // 그래프 마진값임.. 모바일 대응 어케하냐~~~ㅋㅋㅋ....

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scalePoint()
      .domain(data.map((crime) => crime.범죄중분류))
      .range([0, width - margin.left - margin.right])
      .padding(0.5);

    const maxY = d3.max(data, (d) => d.data) as number;
    const adjustedData = data.map((d) => ({
      ...d,
      adjusted: Math.min(d.data, 2000),
    }));

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(adjustedData, (d) => d.adjusted) as number])
      .range([height - margin.top - margin.bottom, 20]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 선 생성 + 애니메이션 효과 추가
    const line = d3
      .line<CrimeData>()
      .x((d) => xScale(d.범죄중분류)!)
      .y((d) => yScale(Math.min(d.data, 2000)))
      .curve(d3.curveMonotoneX);

    const path = chartGroup
      .append("path")
      .datum(adjustedData)
      .attr("fill", "none")
      .attr("stroke", "#FF66B2")
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

    // 점 추가
    chartGroup
      .selectAll(".dot")
      .data(adjustedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.범죄중분류)!)
      .attr("cy", (d) => yScale(d.adjusted))
      .attr("r", 4)
      .attr("fill", "#FF1493")
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr("opacity", 1);

    // 점 위에 데이터 값 추가
    chartGroup
      .selectAll(".data-label")
      .data(adjustedData)
      .enter()
      .append("text")
      .attr("class", "data-label")
      .attr("x", (d) => xScale(d.범죄중분류)!)
      .attr("y", (d) => yScale(d.adjusted) - 10) //점보다 위쪽으로 배치
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .attr("opacity", 0) // 처음에는 안 보이게
      .text((d) => d.data) //  숫자 추가
      .transition()
      .delay((_, i) => i * 100) //  점과 같이 나타나도록 딜레이 추가
      .duration(500)
      .attr("opacity", 1); //  점점 나타나게 함

    //  X축 추가
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#333")
      .attr("transform", "rotate(0)")
      .style("text-anchor", "middle");

    //  검은색 X축 선 제거
    chartGroup.selectAll(".domain").remove();
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntelligenceCrimeLineChart;
