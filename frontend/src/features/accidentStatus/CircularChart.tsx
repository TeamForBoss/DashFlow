import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { ByCarTypeData } from "../../pages/AccidentStatusPage";

interface PropsType { 
    lawData: ByCarTypeData[];
}
const CircularChart = (lawData: PropsType) => {
    const [width, setWidth] = useState<any>(0);
    const [height, setHeight] = useState<any>(0); 
    const svgRef = useRef(null);
    let { lawData: carArr } = lawData;
    // console.log(carArr);
    const handleResize = () => {
        const width = document.querySelector(".acLawGraph")?.clientWidth ?? 300;
        const height = document.querySelector(".acLawGraph")?.clientHeight ?? 300;
        const minVal = Math.min(width, height);
        setWidth(width);
        setHeight(minVal);
    };
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // const radius = Math.min(width, height) / 2;
   
    // const arc = d3.arc<any>()
    //     .innerRadius(radius * 0)
    //     .outerRadius(radius - 1)
        
    // const pie = d3.pie<ByCarTypeData>()
    //     .padAngle(4 / radius)
    //     .sort(null)
    //     .value(d => d.value);
    
    // const color = d3.scaleOrdinal<string>([
    //     "#fffbbc", "#fff672", "#FFE066", "#ffee00", "#ffd900", "#ffc62a", "#ffa51e", "#ff9100"
    // ]);
    // console.log(width)
    useEffect(() => {

    const pieWidth = width * 0.5; 
    const radius = Math.min(pieWidth, height) / 2 - 20;

    //   데이터 내림차순 정렬
    const sortedData = [...carArr].sort((a, b) => a.data - b.data);

    //   색상 설정
    const color = d3.scaleOrdinal<string>([
        "#fffbbc", "#fff672", "#FFE066", "#ffee00", "#ffd900", "#ffc62a", "#ffa51e", "#ff9100"
    ]);

    const pie = d3.pie<ByCarTypeData>().value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<ByCarTypeData>>()
      .innerRadius(0)
      .outerRadius(radius);

    //   기존 SVG 내용 삭제 후 새로 그리기
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    //   파이 차트 그룹 (왼쪽 배치)
    const g = svg.append("g").attr(
      "transform",
      `translate(${width / 3}, ${height / 2})` 
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
      .attr("fill", (_d, i) => color(String(i)))
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
        
    arcs
        .attr("font-size", "10px")
        .attr("font-family","GowunDodum-Regular")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(carArr))
        .join("text")
        // .text(d => d.value.toLocaleString("en-US"))
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("fill", "#333")
        .text((d) => d.data.value > 100 ? d.data.value : "")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("opacity", 1)
        
        const legend = svg.append("g")
            .attr(
                "transform",
                `translate(${width * 0.8}, ${
                height / 2 - (height/2.5)
                })`
            )
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(carArr)
            .enter()
            .append("g")
            .attr("transform", (_d, i) => `translate(0, ${i * (height/10)})`);

        legend.append("rect")
            .attr("x", -width / 4.5)
            .attr("width", height/10)
            .attr("height", height/10)
            .attr("fill", (_d, i) => color(String(i)));

        legend.append("text")
            .attr("x", -width/6.3)
            .attr("y", height/15)
            .attr("dy", "0.32em")
            .text(d => d.name)
            .attr("font-size", "1.2rem")

    // SVG 요소 선택
    //     const svg = d3.select(svgRef.current);

    // // 기존 그래프 초기화
    // svg.selectAll("*").remove();
        
    // // SVG 크기 및 뷰박스 설정
    // svg             
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("viewBox", [
    //         -width / 10,
    //         -height / 2,
    //         width / 1.8,
    //         height
    //     ])
    //     .attr("style", "max-width: 100%; max-height: auto;")
    //     // 애니메이션이 있는 pie chart path 추가
    

    // svg.append("g")
    //     .selectAll()
    //     .data(pie(carArr))
    //     .join("path")
    //     // .attr("fill", d => color(d.data.name))
    //     .attr("fill",(_d,i)=> color(String(i)))
    //         .attr("d", arc)
    //      .style("stroke", "#fff")
    //   .style("stroke-width", "2px")
    //   .transition()
    //   .duration(1000)
    //   .attrTween("d", function (d) {
    //     const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
    //     return function (t) {
    //       return arc(i(t)) as string;
    //     };
    //   });
    //     // .append("title")
    //     //     .text(d => `${d.data.name}: ${d.value.toLocaleString()}`)
    
    // svg
    //     .append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "1.2rem")
    //     .attr("text-anchor", "middle")
    //     .selectAll()
    //     .data(pie(carArr))
    //     .join("text")
    //     .text(d => d.value.toLocaleString("en-US"))
    //     .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    //     .attr("fill", "#333")
    //     .style("font-weight", "bold")
    //     .text((d) => d.data.value != 0 ? d.data.value : "")
    //     .attr("opacity", 0)
    //     .transition()
    //     .duration(1000)
    //     .delay(1000)
    //     .attr("opacity", 1)
        
    //     const legend = svg.append("g")
    //         .attr("transform", `translate(${width/2},${-height / 2 + (height/10)})`)
    //         .attr("text-anchor", "start")
    //         .selectAll("g")
    //         .data(carArr)
    //         .enter()
    //         .append("g")
    //         .attr("transform", (_d, i) => `translate(0, ${i * (height/10)})`);

    //     legend.append("rect")
    //         .attr("x", -width /4.5)
    //         .attr("width", height/10)
    //         .attr("height", height/10)
    //         .attr("fill", (_d, i) => color(String(i)));

    //     legend.append("text")
    //         .attr("x", -width/6.3)
    //         .attr("y", height/15)
    //         .attr("dy", "0.32em")
    //         .text(d => d.name)
    //         .attr("font-size", "1.2rem")

    
  }, [carArr, width, height]);

  return (<svg ref={svgRef}></svg>);
};

export default CircularChart;
