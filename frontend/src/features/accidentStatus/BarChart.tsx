import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { ByAccTypeData } from "../../pages/AccidentStatusPage";

interface PropsType {
    accData: ByAccTypeData[];
}
const BarChart = (accData: PropsType) => {
    const [width, setWidth] = useState<any>(0);
    const [height, setHeight] = useState<any>(0);
    const [fontSize, setFontSize] = useState<string>("10px");
    const svgRef = useRef(null);
    let { accData: accArr } = accData;
    // console.log(accArr);
    const handleResize = () => {
        const width = document.querySelector(".acYearGraph")?.clientWidth;
        const height = document.querySelector(".acYearGraph")?.clientHeight;
        setWidth(width);
        setHeight(height);
        if (window.innerWidth < 900) {
            setFontSize("6px");
        } else {     
            setFontSize("11px");
        }
    };
    console.log(width, height);
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    // 그래프 크기 및 마진 설정
    const marginTop = 40;
    const marginRight = 40;
    const marginBottom = 40;
    const marginLeft = 40;

    // x축 (type 스케일) 설정
    const x = d3
        .scaleBand()
        .domain(accArr.map(d => d.type))
        .range([marginLeft, width - marginRight]);

    // y축 (death 스케일) 설정
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.death) ?? 0])
        .nice()
        .range([height - marginBottom, marginTop]);

    // y축 (death 스케일) 설정
    const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.acc) ?? 0])
        .nice()
        .range([height - marginBottom, marginTop]);
    // console.log(width/100+2)
    // 선(line) 생성 함수 정의
    const line = d3
        .line<ByAccTypeData>()
        .x(d => x(d.type)!) // x축 좌표 설정
        .y(d => y(d.death)) // y축 좌표 설정
    const line1 = d3
        .line<ByAccTypeData>()
        .x(d => x(d.type)! + width / 22) // x축 좌표 설정
        .y(d => y1(d.acc)) // 두 번째 y축 좌표 설정 (acc)
    // .curve(d3.curveMonotoneX); // 부드러운 곡선 적용

    useEffect(() => {
        // SVG 요소 선택
        const svg = d3.select(svgRef.current);

        // 기존 그래프 초기화
        svg.selectAll("*").remove();

        // SVG 크기 및 뷰박스 설정
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // x축 추가
        svg
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
            .selectAll("text") // x축의 텍스트 선택
            .style("font-size", fontSize); // font-size 변경

        // y축 추가 (death 그리드 라인 포함)
        svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 80))
            .call(g => g.select(".domain").remove()) // 축의 라인 제거
            .call(g =>
                g
                    .selectAll(".tick line")
                    .clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1)

            )
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "#333")
                .attr("text-anchor", "start")
                .attr("font-size", "1.1rem")
                .text("( 단위: 명 )")
            );
        // y1축 추가 (acc 그리드 라인 포함)
        svg
            .append("g")
            .attr("transform", `translate(${width - marginRight},0)`)
            .call(d3.axisRight(y1).ticks(height / 40))
            .call(g => g.select(".domain").remove()); // 축의 라인 제거

        // 그래프 바(bar) 애니메이션
        svg.append("g")
            .attr("fill", "#fff672")
            .selectAll()
            .data(accArr)
            .join("rect")
            .attr("x", (d) => (x(d.type) ?? 0) + 3) 
            .attr("y", height - marginBottom)
            .attr("height", 0)
            .attr("width", x.bandwidth() - 6)
            .transition()
            .duration(1000)
            .attr("y", (d) => y(d.death))
            .attr("height", (d) => y(0) - y(d.death));

        // 그래프 라인(line) 애니메이션
        svg
            .append("path")
            .datum(accArr)
            .attr("fill", "none")
            .attr("stroke", "#ff9100")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("stroke-dasharray", function () {
                const length = (this as SVGPathElement).getTotalLength();
                return length;
            })
            .attr("stroke-dashoffset", function () {
                const length = (this as SVGPathElement).getTotalLength();
                return length;
            })
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        // 원(circle) 애니메이션
        svg.append("g")
            .selectAll("circle")
            .data(accArr)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.type)! + width / 22)
            .attr("cy", (d) => y1(d.acc))
            .attr("r", 4)
            .attr("fill", "#fff")
            .attr("stroke", "#ff9100")
            .attr("stroke-width", 2)
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .delay((_, i) => i * 100)
            .attr("opacity", 1);


        //graph bar
        // svg.append("g")
        //     .attr("fill", "#F3E796")
        //     .selectAll()
        //     .data(accArr)
        //     .join("rect")
        //     .attr("x", (d) => x(d.type) ?? 0)
        //     .attr("y", (d) => y(d.death))
        //     .attr("height", (d) => y(0) - y(d.death))
        //     .attr("width", x.bandwidth());  

        // // graph line
        // svg
        //   .append("path")
        //   .datum(accArr) 
        //   .attr("fill", "none")
        //   .attr("stroke", "#FBC02D") 
        //   .attr("stroke-width", 1.5)
        //         .attr("d", line1);

        //  svg.append("g")
        //         .selectAll("circle")
        //         .data(accArr)
        //         .enter()
        //         .append("circle")
        //         .attr("cx", d => x(d.type)! + width / 22)  
        //         .attr("cy", d => y1(d.acc))         
        //         .attr("r", 4)                       
        //         .attr("fill", "#fff")            
        //         .attr("stroke", "#FBC02D")             
        //         .attr("stroke-width", 2); 
    }, [x, y, line, accArr]);

    return (<svg ref={svgRef}></svg>);
};

export default BarChart;
