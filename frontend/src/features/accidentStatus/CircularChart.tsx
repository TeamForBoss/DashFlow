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
        const width = document.querySelector(".acYearGraph")?.clientWidth ?? 300;
        const height = document.querySelector(".acYearGraph")?.clientHeight ?? 300;
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

    // const width = 200;
    // const height = Math.min(width, 200);
    const radius = Math.min(width, height) / 2;
    const margin = 30;
   
    const arc = d3.arc<any>()
        .innerRadius(radius * 0)
        .outerRadius(radius - 1)
        
    const pie = d3.pie<ByCarTypeData>()
        .padAngle(4 / radius)
        .sort(null)
        .value(d => d.value);
    
    const color = d3.scaleOrdinal<string>([
        "#FFFFD5",
        "#FFFF96",
        "#F9E3AF",
        "#FFEB3B", 
        "#FFCC80", 
        "#FF9800", 
        "#FFA726", 
        "#FBC02D"  
    ]);
    // console.log(width)
    useEffect(() => {
    // SVG 요소 선택
        const svg = d3.select(svgRef.current);

    // 기존 그래프 초기화
    svg.selectAll("*").remove();
        
    // SVG 크기 및 뷰박스 설정
    svg             
        .attr("width", width/2.6)
        .attr("height", height)
        .attr("viewBox", [
            -width / 10,
            -height / 2,
            width / 2.6,
            height
        ])
        .attr("style", "max-width: 200%; max-height: 100%;")
        // 애니메이션이 있는 pie chart path 추가
    

    svg.append("g")
        .selectAll()
        .data(pie(carArr))
        .join("path")
        // .attr("fill", d => color(d.data.name))
        .attr("fill",(_d,i)=> color(String(i)))
            .attr("d", arc)
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
        // .append("title")
        //     .text(d => `${d.data.name}: ${d.value.toLocaleString()}`)
    
    svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(carArr))
        .join("text")
        .text(d => d.value.toLocaleString("en-US"))
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("fill", "#333")
        .style("font-weight", "bold")
        .text((d) => d.data.value != 0 ? d.data.value : "")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("opacity", 1)
        
        
    // svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 16)
    //     .attr("text-anchor", "middle")
    //     .selectAll()
    //     .data(pie(carArr))
    //     .join("text")
    //     .attr("transform", d => `translate(${arc.centroid(d)})`)
    //     //   .call(text => text.append("tspan")
    //     //       .attr("x", 0)
    //     //       .attr("y", "-0.7em")
    //     //       .attr("font-weight", "bold")
    //     //       .text(d => d.data.name))
    //     .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.1).append("tspan")
    //         .attr("x", 0)
    //         .attr("y", "0.3em")
    //         .attr("fill-opacity", 0.7)
    //         .text(d => d.value.toLocaleString("en-US")));
        
        const legend = svg.append("g")
            .attr("transform", `translate(${width / 2.6 -(width/100)},${-height / 2 + (height/10)})`)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(carArr)
            .enter()
            .append("g")
            .attr("transform", (_d, i) => `translate(0, ${i * (height/10)})`);

        legend.append("rect")
            .attr("x", -width /4.5)
            .attr("width", height/10)
            .attr("height", height/10)
            .attr("fill", (_d, i) => color(String(i)));

        legend.append("text")
            .attr("x", -width/5.3)
            .attr("y", height/15)
            .attr("dy", "0.32em")
            .text(d => d.name)
            .attr("font-size", 14)

    
  }, [carArr, width, height]);

  return (<svg ref={svgRef}></svg>);
};

export default CircularChart;
