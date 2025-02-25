import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface WeatherData {
  dt_txt: string;
  main: { temp: number; };
}

const WeatherTrendGraph = ({ data }: { data: WeatherData[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      const parent = d3.select(svgRef.current).node()?.parentElement as HTMLElement;
      if (parent) {
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const { width, height } = dimensions;
    const isMobile = width < 700;
    const margin = isMobile
      ? { top: 20, right: 20, bottom: 15, left: 18 }
      : { top: 25, right: 50, bottom: 25, left: 60 };

    const parsedData = data
      .map(d => ({
        date: d3.timeParse("%Y-%m-%d %H:%M:%S")(d.dt_txt),
        temp: d.main.temp,
      }))
      .filter(d => d.date !== null) as { date: Date; temp: number }[];

    // SVG 초기화
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "visible");

    const xDomain = d3.extent(parsedData, d => d.date) as [Date, Date];
    const overallMin = d3.min(parsedData, d => d.temp)!;
    const overallMax = d3.max(parsedData, d => d.temp)!;
    const padding = (overallMax - overallMin) * 0.1;
    const domainMin = overallMin - padding;
    const domainMax = overallMax + padding;

    const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([domainMin, domainMax])
      .range([height - margin.bottom, margin.top]);

    // X축 (글씨 가로 배치)
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(d3.timeHour.every(6))
          .tickFormat(d3.timeFormat("%m-%d %H시")!)
      )
      .attr("class", "x-axis")
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666")
      .attr("transform", null)
      .style("text-anchor", "middle");

    // Y축
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(6))
      .attr("class", "y-axis")
      .selectAll("text")
      .style("font-size", "14px")
      .style("fill", "#444");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => "")
      )
      .attr("stroke", "#ccc")
      .attr("opacity", 0.4);

    // 영역(area) 생성 및 애니메이션
    const areaGen = d3.area<{ date: Date; temp: number }>()
      .x(d => xScale(d.date))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#B2DFDB")
      .attr("stop-opacity", 0);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#B2DFDB")
      .attr("stop-opacity", 0.8);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#areaGradient)")
      .attr("d", areaGen as any)
      .attr("opacity", 0)
      .transition()
      .duration(2000)
      .attr("opacity", 1);

    const line = d3.line<{ date: Date; temp: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    const linePath = svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#AAF0D1")
      .attr("stroke-width", 3)
      .attr("d", line as any);

    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
    linePath
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    svg.selectAll(".dot")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.temp))
      .attr("r", 0) // 초기 반지름 0
      .attr("fill", "#AAF0D1")
      .attr("stroke", "#80cfa9")
      .attr("stroke-width", 1)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 4);

    svg.selectAll(".label-temp")
      .data(parsedData)
      .enter()
      .append("text")
      .attr("class", "label-temp")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.temp) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#00796B")
      .style("opacity", 0)
      .text(d => `${d.temp.toFixed(1)}°C`)
      .transition()
      .delay(2000)
      .duration(500)
      .style("opacity", 1);

    // 툴팁
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(255, 255, 255, 0.95)")
      .style("padding", "10px 15px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "6px")
      .style("box-shadow", "0px 2px 8px rgba(0, 0, 0, 0.1)")
      .style("pointer-events", "none")
      .style("font-family", "sans-serif")
      .style("font-size", "13px")
      .style("color", "#333")
      .style("opacity", 0);

    svg.selectAll(".dot")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        const formattedDate = d3.timeFormat("%m/%d일")(d.date);
        const hours = d.date.getHours();
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
        const period = hours >= 12 ? "오후" : "오전";
        const formattedTime = `${period} ${displayHour}시`;
        tooltip.html(
          `<strong>📅 ${formattedDate} ${formattedTime}</strong><br/>
          🌍 평균 기온: ${d.temp.toFixed(1)}°C`
        )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
    
  }, [data, dimensions]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WeatherTrendGraph;
