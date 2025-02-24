import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface WeatherData {
  dt_txt: string;
  main: {
    temp: number;
  };
}

const WeatherTrendGraph = ({ data }: { data: WeatherData[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 1) 데이터 파싱
    const parsedData = data
      .map(d => ({
        date: d3.timeParse("%Y-%m-%d %H:%M:%S")(d.dt_txt),
        temp: d.main.temp,
      }))
      .filter(d => d.date !== null) as {
      date: Date;
      temp: number;
    }[];

    // 2) SVG 크기 및 마진 설정
    const parent = d3.select(svgRef.current).node()?.parentElement as HTMLElement;
    const width = parent?.clientWidth || 800;
    const height = parent?.clientHeight || 500;
    const margin = { top: 20, right: 80, bottom: 40, left: 60 };

    // 기존 SVG 내용 삭제
    d3.select(svgRef.current).selectAll("*").remove();

    // 3) SVG 생성
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "visible");

    // 4) 스케일 설정
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

    // 5) 축 그리기
    // X축
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(d3.timeHour.every(6))
          .tickFormat(d3.timeFormat("%m-%d %H:%M")!)
      )
      .attr("class", "x-axis")
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // Y축
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(6))
      .attr("class", "y-axis")
      .selectAll("text")
      .style("font-size", "14px")
      .style("fill", "#444");

    // 그리드 라인
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => "")
      )
      .attr("stroke", "#ccc")
      .attr("opacity", 0.4);

    // 6) 영역(선 그래프 ~ X축) 채우기: 위로 갈수록 투명
    const areaGen = d3.area<{ date: Date; temp: number }>()
      .x(d => xScale(d.date))
      .y0(height - margin.bottom)   // X축
      .y1(d => yScale(d.temp))      // 선 그래프
      .curve(d3.curveMonotoneX);

    // 그라데이션 정의 (상단 투명, 하단 진한)
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    // 상단(0%)은 완전 투명
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#B2DFDB") 
      .attr("stop-opacity", 0);
    // 하단(100%)은 불투명 민트
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#B2DFDB")
      .attr("stop-opacity", 0.8);

    // 영역 경로 생성
    svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#areaGradient)")
      .attr("d", areaGen as any);

    // 7) 선 그래프
    const line = d3.line<{ date: Date; temp: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#AAF0D1") 
      .attr("stroke-width", 3)
      .attr("d", line as any);

    // 8) 데이터 포인트
    svg.selectAll(".dot")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.temp))
      .attr("r", 4)
      .attr("fill", "#AAF0D1");

    // 데이터 포인트 위에 온도 텍스트 레이블
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
      .text(d => `${d.temp.toFixed(1)}°C`);

    // 9) 툴팁
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
        tooltip.html(
          `<strong>${d3.timeFormat("%m-%d %H:%M")(d.date)}</strong><br/>
           Temp: ${d.temp}°C`
        )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

  }, [data]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WeatherTrendGraph;
