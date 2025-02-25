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
  const [color1, setColor1] = useState("#FF1493");
  const [color2, setColor2] = useState("#FFA500");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!data1.length || !data2.length || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const width = containerWidth;
    const height = containerHeight;

    const margin =
      windowWidth <= 650
        ? { top: 10, right: 20, bottom: 50, left: 10 } //   x축 범죄 유형 추가하려면 bottom 공간 늘려야 함!
        : { top: 20, right: 20, bottom: 50, left: 20 };

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

    const avg1 = d3.mean(data1, (d) => d.data) || 0;
    const avg2 = d3.mean(data2, (d) => d.data) || 0;

    if (avg1 < avg2) {
      setColor1("#FFA500");
      setColor2("#FF1493");
    } else {
      setColor1("#FF1493");
      setColor2("#FFA500");
    }

    const isData1Higher = (index: number) =>
      data1[index].data >= data2[index].data;

    const createLine = (
      data: CrimeData[],
      color: string,
      isHigher: (index: number) => boolean
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

      //   동글맹이 (circle) 다시 추가
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

      //   숫자 위치 조정
      chartGroup
        .selectAll(`.label-${color}`)
        .data(data)
        .enter()
        .append("text")
        .attr("class", `label-${color}`)
        .attr("x", (d) => xScale(d.범죄중분류)!)
        .attr("y", (d, i) =>
          isHigher(i) ? yScale(d.data) - 10 : yScale(d.data) + 15
        )
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

    createLine(data1, color1, isData1Higher);
    createLine(data2, color2, (index) => !isData1Higher(index));

    //   x축 범죄 유형(범죄중분류) 추가
    chartGroup
      .selectAll(".x-label")
      .data(data1)
      .enter()
      .append("text")
      .attr("class", "x-label")
      .attr("x", (d) => xScale(d.범죄중분류)!)
      .attr("y", height - margin.bottom + 20) //   x축 아래쪽에 위치
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text((d) => d.범죄중분류);
  }, [data1, data2, windowWidth, color1, color2]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {/*   범례 색상과 글자 색상 적용 */}
      <div
        style={{
          position: "absolute",
          top: windowWidth <= 650 ? "5px" : "10px",
          right: windowWidth <= 650 ? "190px" : "50px",
          background: "rgba(255,255,255,0.7)",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "13px",
          zIndex: 10,
          color: "#333", //   범례 글자 색상 적용
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: color1,
              borderRadius: "50%",
              marginRight: "5px",
            }}
          ></div>
          해당 지역
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: color2,
              borderRadius: "50%",
              marginRight: "5px",
            }}
          ></div>
          경기도 평균
        </div>
      </div>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntelligenceCrimeLineChart;
