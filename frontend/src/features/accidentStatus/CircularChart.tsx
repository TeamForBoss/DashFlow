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
    carArr.sort((a, b) => b.value - a.value);
    // console.log(carArr);
    const handleResize = () => {
        const width = document.querySelector(".acLawGraph")?.clientWidth ?? 300;
        const height = document.querySelector(".acLawGraph")?.clientHeight ?? 300;
        const minVal = Math.min(width, height-20);
        setWidth(width);
        setHeight(minVal);
    };
    const allWidth = window.innerWidth;
    let moveCenter = 1.2;
    let fontSize = "1.2rem";
    if (allWidth < 600) {
        fontSize = "0.8rem";
    }
    // console.log(moveCenter,width)
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const radius = Math.min(width, height) / 2;
   
    const arc = d3.arc<any>()
        .innerRadius(radius * 0)
        .outerRadius(radius - 1)
        
    const pie = d3.pie<ByCarTypeData>()
        .padAngle(4 / radius)
        .sort(null)
        .value(d => d.value);
    
    const color = d3.scaleOrdinal<string>(
    ["#FF6F00", "#FF8C1A", "#FFB300", "#FFDC00", "#FFEA00", "#D4C200", "#B8A500", "#8C7F00"]

);
    // console.log(width)
    useEffect(() => {
    // SVG 요소 선택
        const svg = d3.select(svgRef.current);

    // 기존 그래프 초기화
    svg.selectAll("*").remove();
        
    // SVG 크기 및 뷰박스 설정
    svg             
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [
            -radius,
            -radius,
            width/moveCenter,
            height
        ])
        .attr("style", "max-width: 100%; max-height: auto;")
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
        .attr("font-size", "1rem")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(carArr))
        .join("text")
        .text(d => d.value.toLocaleString("en-US"))
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("fill", "#333")
        .style("font-weight", "bold")
        .text((d) => d.data.value > 1 ? d.data.value : "")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .delay(1000)
            .attr("opacity", 1)
        
    const legend = svg.append("g")
        .attr(
            "transform",
            `translate(${width/2}, ${
            -height / 2.5
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
        .attr("font-size", fontSize)

  }, [carArr, width, height]);

  return (<svg ref={svgRef}></svg>);
};

export default CircularChart;
