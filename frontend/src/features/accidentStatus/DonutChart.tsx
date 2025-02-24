import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ByCarTypeData } from "../../pages/AccidentStatusPage";

interface PropsType { 
    carData: ByCarTypeData[];
}
const DonutChart = (carData : PropsType) => {
    const svgRef = useRef(null);
    let { carData: carArr } = carData;
    // console.log(carArr);

    const width = 200;
    const height = Math.min(width, 200);
    const radius = Math.min(width, height) / 2;
    const margin = 20;
   
    const arc = d3.arc<any>()
        .innerRadius(radius * 0.55)
        .outerRadius(radius - 1)
        
    const pie = d3.pie<ByCarTypeData>()
        .padAngle(4 / radius)
        .sort(null)
        .value(d => d.value);
    
    const color = d3.scaleOrdinal<string>([
        "#FFFFD5",
        "#FFFF96",
        "#F9E3AF",
        "#ffcc80",
        "#ffa726",
        "#ff9800" 
    ]);

    useEffect(() => {
    // SVG 요소 선택
        const svg = d3.select(svgRef.current);

    // 기존 그래프 초기화
    svg.selectAll("*").remove();
        
    // SVG 크기 및 뷰박스 설정
    svg             
        .attr("width", width*2-margin)
        .attr("height", height-margin)
        .attr("viewBox", [
            -width / 4.5,
            -height / 2 -1,
            width,
            height
        ])
        .attr("style", "max-width: 100%; height: auto;")

    svg.append("g")
        .selectAll()
        .data(pie(carArr))
        .join("path")
        // .attr("fill", d => color(d.data.name))
        .attr("fill",(_d,i)=> color(String(i)))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.value.toLocaleString()}`)

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 13)
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(carArr))
        .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        //   .call(text => text.append("tspan")
        //       .attr("x", 0)
        //       .attr("y", "-0.7em")
        //       .attr("font-weight", "bold")
        //       .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.1).append("tspan")
            .attr("x", 0)
            .attr("y", "0.4em")
            .attr("fill-opacity", 0.7)
            .text(d => d.value.toLocaleString("en-US")));
        
        const legend = svg.append("g")
            .attr("transform", `translate(${width / 2 + 20},${-height / 2 + 20})`)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(carArr)
            .enter()
            .append("g")
            .attr("transform", (_d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", -width+margin+height)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", (_d, i) => color(String(i)));

        legend.append("text")
            .attr("x", -width+margin+height+30)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(d => d.name);
    
  }, [carArr]);

  return (<svg ref={svgRef}></svg>);
};

export default DonutChart;
