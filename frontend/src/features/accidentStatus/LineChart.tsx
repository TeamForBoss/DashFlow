import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { ByYearTypeData } from "../../pages/AccidentStatusPage";

interface PropsType {
    yearData: ByYearTypeData[];
}
const LineChart = (yearData: PropsType) => {
    const [width, setWidth] = useState<any>(0);
    const [height, setHeight] = useState<any>(0);
    const svgRef = useRef(null);
    let { yearData: accArr } = yearData;
    
    let moveVal = 0;
    let padding = 90;
    let fontSize = "15px";
    const mobData = accArr.filter((obj) => { 
        return (Number(obj.year) % 3 == 1 ? obj : null)
    });
    if (width < 600) {
        accArr = mobData; 
        moveVal = width / 22;
        padding = 30;
        fontSize ="10px";
    }

    const handleResize = () => {
        const width = document.querySelector(".acYearGraph")?.clientWidth ?? 800;
        const height = document.querySelector(".acYearGraph")?.clientHeight ?? 300;
            setWidth(width);
            setHeight(height);
        // console.log(accArr)
    };
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 그래프 크기 및 마진 설정
    // const width = 1000;
    // const height = 300;
    const margin = 30;

    // x축 (type 스케일) 설정
    const x = d3
        .scaleBand()
        .domain(accArr.map(d => d.year))
        .range([margin, width - margin]);

    // y축 (inj 스케일) 설정
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - margin, margin]);
    // y축 (acc 스케일) 설정
    const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - margin, margin]);
    // y축 (death 스케일) 설정
    const y2 = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - margin, margin]);


    // 선(line) 생성 함수 정의
    const line = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + width/31+moveVal) // x축 좌표 설정
        .y(d => y(d.inj)) // y축 좌표 설정
    const lineAcc = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + width/31+moveVal) // x축 좌표 설정
        .y(d => y1(d.acc)) // 두 번째 y축 좌표 설정 (acc)
    const lineDth = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + width/31+moveVal) // x축 좌표 설정
        .y(d => y2(d.death)) // 두 번째 y축 좌표 설정 (acc)

    useEffect(() => {
        // SVG 요소 선택
        const svg = d3.select(svgRef.current);

        // 기존 그래프 초기화
        svg.selectAll("*").remove();

        // SVG 크기 및 뷰박스 설정
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-padding/1.2, 0, width+padding, height])
            .attr("style", "max-width: 100%; height: auto;");

        // x축 추가
        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
            .selectAll("text")
            .attr("font-size", fontSize)
            .style("fill", "#333");

        // y축 추가 (death 그리드 라인 포함)
        // svg
        //   .append("g")
        //   .attr("transform", `translate(${marginLeft},0)`)
        //   .call(d3.axisLeft(y).ticks(height / 80))
        //   .call(g => g.select(".domain").remove()) // 축의 라인 제거
        //   .call(g =>
        //     g
        //       .selectAll(".tick line")
        //       .clone()
        //       .attr("x2", width - marginLeft - marginRight)
        //           .attr("stroke-opacity", 0.1)

        //   )
        //   .call(g => g.append("text")
        //       .attr("x", -marginLeft)
        //       .attr("y", 10)
        //       .attr("fill", "currentColor")
        //       .attr("text-anchor", "start")
        //       .text("( 단위: 명 )")
        //     );
        // y1축 추가 (acc 그리드 라인 포함)
        svg
            .append("g")
            .attr("transform", `translate(${width - margin},0)`)
            .call(d3.axisRight(y1).ticks(height / 40))
            .call(g => g.select(".domain").remove());

        // graph line(inj)
        const drawLine = (line: any, color: string, key: string ) => {
            const path = svg
                .append("path")
                .datum(accArr)
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
            
        svg.append("g")
            .selectAll(`.dot-${color}`)
            .data(accArr)
            .enter()
            .append("circle")
            .attr("class", `dot-${color}`)
            .attr("cx", (d) => x(d.year)! + width / 31 +moveVal)
            .attr("cy", (d) => y1(Number(d[key as keyof ByYearTypeData])))
            .attr("r", 8)
            .attr("fill", "#fff")
            .attr("stroke", color)
            .attr("stroke-width", 7)
            .attr("opacity", 0)
            .transition()
            .delay((_, i) => i * 100) 
            .duration(500)
                .attr("opacity", 1); 
            
        svg.append("g")
            .selectAll()
            .data(accArr)
            .join("text")
            .attr("class", "line-label")
            .attr("x", (d) => (x(d.year)?? 0) + x.bandwidth() / 2)
            .attr("y", (d) => y1(Number(d[key as keyof ByYearTypeData])) - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .style("fill", "#333")
            .text((d) => d[key as keyof ByYearTypeData])
            .attr("opacity", 0)
            .transition()
            .delay((_, i) => i * 100)
            .duration(500)
            .attr("opacity", 1);
        };

        drawLine(line, "#ff9100", "inj");    // 부상자 (inj)
        drawLine(lineAcc, "#ffd900","acc"); // 사고건수 (acc)
        drawLine(lineDth, "#F7E38D","death"); // 사망자 (death)

               const nameArr = ["부상자", "사고건수", "사망자"];
        const colorArr = ["#ff9100", "#ffd900", "#F7E38D "];

        const legend = svg.append("g")
            .attr("transform", `translate(${margin - (width / 10)}, 0)`);
        // console.log(height)
        legend.selectAll("g")
            .data(nameArr)
            .enter()
            .append("g")
            .attr("transform", (_d, i) => `translate(0, ${i * (height / 3.3)})`)
            .each((d, i, arr) => {
                const group = d3.select(arr[i]);

                group.append("rect")
                    .attr("x", 0)
                    .attr("width", (width /10))
                    .attr("height", (height / 3.3))
                    .attr("fill", colorArr[i]);

                group.append("text")
                    .attr("x", width / 20)
                    .attr("y", height / 6.7)
                    .attr("dy", "0.32em")
                    .attr("font-size", fontSize)
                    .attr("fill", "#666")
                    .attr("text-anchor", "middle")
                    .text(d);
            });
        


    }, [x, y, line, accArr]);

    return (<svg ref={svgRef}></svg>);
};

export default LineChart;
