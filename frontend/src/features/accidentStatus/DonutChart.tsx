import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { ByCarTypeData } from "../../pages/AccidentStatusPage";

interface PropsType { 
    carData: ByCarTypeData[];
}
const DonutChart = (carData: PropsType) => {
    const [width, setWidth] = useState<any>(0);
    const [height, setHeight] = useState<any>(0);
    const svgRef = useRef(null);
    let { carData: carArr } = carData;

    carArr.sort((a, b) => b.value- a.value);
    const handleResize = () => {
        const width = document.querySelector(".acTypeGraph")?.clientWidth ?? 300;
        const height = document.querySelector(".acTypeGraph")?.clientHeight ?? 300;
        const minVal = Math.min(width, height-20);
        setWidth(width);
        setHeight(minVal);
    };
    // console.log(width, height)
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const allWidth = window.innerWidth;
    let moveCenter = 1.2;
    let fontSize = "1.2rem";
    if (allWidth < 600) {
        fontSize = "0.8rem";
    }
    useEffect(() => {
        //     console.log(width,height)
        const radius = Math.min(width, height) / 2;
        // console.log(radius)
        const arc = d3.arc<any>()
            .innerRadius(radius * 0.55)
            .outerRadius(radius - 1)
            
        const pie = d3.pie<ByCarTypeData>()
            .padAngle(4 / radius)
            .sort(null)
            .value(d => d.value);
        
        const color = d3.scaleOrdinal<string>(
            // ["#ff9100", "#ffc62a", "#F7D400", "#F7E38D"]
            ["#FF8C1A", "#FFB300", "#FFDC00", "#FFEA00"]
        );
    // SVG 요소 선택
    const svg = d3.select(svgRef.current);

    // 기존 그래프 초기화
    svg.selectAll("*").remove();
        
    // // SVG 크기 및 뷰박스 설정
    svg             
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [
            -radius,
            -radius,
            width/moveCenter,
            height
        ])
        .attr("style", "min-width: 100%; max-height: auto;")
    
        // 애니메이션
    svg
        .append("g")
      .selectAll()
      .data(pie(carArr))
      .join("path")
      .attr("fill", (_d, i) => color(String(i)))
        .attr("d", arc)
        
      .style("stroke", "#fff")
      .style("stroke-width", "2px")
      .attr("opacity", 0) 
      .transition() 
      .duration(1000)
      .delay((d, i) => i * 200) 
      .attr("opacity", 1) 
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) as string;
        };
      });
    
     svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", "1rem")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(carArr))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("fill", "#333")
      .style("font-weight", "bold")
      .text((d) => d.data.value > 1 ? d.data.value : "")
      .attr("opacity", 0) 
      .transition() 
      .duration(1000)
      .delay(500)
      .attr("opacity", 1);
        
        const legend = svg.append("g")
            .attr(
                "transform",
                `translate(${width/2}, ${
                -height/3
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

export default DonutChart;
