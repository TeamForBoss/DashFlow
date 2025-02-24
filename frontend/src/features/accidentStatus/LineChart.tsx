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
    // console.log(accArr);

    const handleResize = () => {
        const width = document.querySelector(".acYearGraph")?.clientWidth;
        const height = document.querySelector(".acYearGraph")?.clientHeight;
        setWidth(width);
        setHeight(height);
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
    const marginTop = 20;
    const marginRight = 40;
    const marginBottom = 30;
    const marginLeft = 40;

    // x축 (type 스케일) 설정
    const x = d3
        .scaleBand()
        .domain(accArr.map(d => d.year))
        .range([marginLeft, width - marginRight]);

    // y축 (inj 스케일) 설정
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - marginBottom, marginTop]);
    // y축 (acc 스케일) 설정
    const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - marginBottom, marginTop]);
    // y축 (death 스케일) 설정
    const y2 = d3
        .scaleLinear()
        .domain([0, d3.max(accArr, d => d.inj) ?? 0])
        .nice()
        .range([height - marginBottom, marginTop]);


    // 선(line) 생성 함수 정의
    const line = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + marginRight) // x축 좌표 설정
        .y(d => y(d.inj)) // y축 좌표 설정
    const lineAcc = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + marginRight) // x축 좌표 설정
        .y(d => y1(d.acc)) // 두 번째 y축 좌표 설정 (acc)
    const lineDth = d3
        .line<ByYearTypeData>()
        .x(d => x(d.year)! + marginRight) // x축 좌표 설정
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
            .attr("viewBox", [-marginLeft * 2, 0, width + 100, height])
            .attr("style", "max-width: 100%; height: auto;");

        // x축 추가
        svg
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

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
            .attr("transform", `translate(${width - marginRight},0)`)
            .call(d3.axisRight(y1).ticks(height / 40))
            .call(g => g.select(".domain").remove()); // 축의 라인 제거

        // graph line(inj)
        svg
            .append("path")
            .datum(accArr)
            .attr("fill", "none")
            .attr("stroke", "#FFF2A5")
            .attr("stroke-width", 1.5)
            .attr("d", line);
        // graph line(acc)
        svg
            .append("path")
            .datum(accArr)
            .attr("fill", "none")
            .attr("stroke", "#FBC02D")
            .attr("stroke-width", 1.5)
            .attr("d", lineAcc);

        // graph line(death)
        svg
            .append("path")
            .datum(accArr)
            .attr("fill", "none")
            .attr("stroke", "#FAFD8D")
            .attr("stroke-width", 1.5)
            .attr("d", lineDth);

        svg.append("g")
            .selectAll("circle")
            .data(accArr)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year)! + marginRight)
            .attr("cy", d => y1(d.inj))
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("stroke", "#FFF2A5")
            .attr("stroke-width", 7);

        svg.append("g")
            .selectAll("circle")
            .data(accArr)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year)! + marginRight)
            .attr("cy", d => y1(d.acc))
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("stroke", "#FBC02D")
            .attr("stroke-width", 7);

        svg.append("g")
            .selectAll("circle")
            .data(accArr)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year)! + marginRight)
            .attr("cy", d => y1(d.death))
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("stroke", "#FAFD8D")
            .attr("stroke-width", 7);

        //         const nameArr = ["사고건수", "사망자", "부상자"];

        //     const legend = svg.append("g")
        //             .attr("transform", `translate(${width / 2 + 20},${-height / 2 + 20})`)
        //             .attr("text-anchor", "start")
        //             .selectAll("g")
        //             .data(nameArr)
        //             .enter()
        //             .append("g")
        //             .attr("transform", (_d, i) => `translate(0, ${i * 20})`);

        //         legend.append("rect")
        //             .attr("x", -width+marginRight+height)
        //             .attr("width", 19)
        //             .attr("height", 19)
        //             .attr("fill", "#FAFD8D");

        //         legend.append("text")
        //             .attr("x", -width+marginRight+height+30)
        //             .attr("y", 9.5)
        //             .attr("dy", "0.32em")
        //             .text(d => d);
        const nameArr = ["사고건수", "사망자", "부상자"];
        const colorArr = ["#FFFFD5", "#FBC02D", "#FAFD8D"];

        const legend = svg.append("g")
            .attr("transform", `translate(${marginLeft - (width / 10)}, 0)`);

        legend.selectAll("g")
            .data(nameArr)
            .enter()
            .append("g")
            .attr("transform", (_d, i) => `translate(0, ${i * (height / 3.5)})`)
            .each((d, i, arr) => {
                const group = d3.select(arr[i]);

                group.append("rect")
                    .attr("x", 0)
                    .attr("width", (width / 10))
                    .attr("height", (height / 3.5))
                    .attr("fill", colorArr[i]);

                group.append("text")
                    .attr("x", width / 20)
                    .attr("y", height / 6.7)
                    .attr("dy", "0.32em")
                    .attr("font-size", "15px")
                    .attr("fill", "#666")
                    .attr("text-anchor", "middle")
                    .text(d);
            });

    }, [x, y, line, accArr]);

    return (<svg ref={svgRef}></svg>);
};

export default LineChart;
