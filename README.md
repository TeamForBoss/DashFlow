# 🚥 안전신호등

> 서울, 경기, 인천 지역의 범죄, 교통사고, 날씨 데이터를 한눈에 확인할 수 있는 대시보드   

---

## 📝 프로젝트 소개
**안전신호등**은 경기도, 서울, 인천 지역의 범죄 발생 현황, 교통사고 통계, 최신 날씨 데이터를 **그래프와 차트**로 시각화하여 보여주는 웹 애플리케이션입니다.   

🚔 **범죄 데이터** – 강력범죄(살인), 폭력범죄(폭행), 지능범죄 등의 발생 빈도를 분석하고 지역별로 시각화   
🚗 교통사고 데이터 – 연도별 사고 및 사망자 수, 사고 유형 및 법규 위반 사고 건수 분석   
🌦️ 날씨 정보 페이지 – 최신 날씨 데이터 및 추세 그래프 제공   

## 🎯 주요 기능
✅ **지역 선택**: 사용자가 원하는 지역(서울, 경기, 인천)을 선택하여 데이터 확인  
✅ **데이터 필터링**: 특정 기간, 범죄 유형, 교통사고 유형 등을 기준으로 데이터 조회  
✅ **시각화**: 라인 차트, 도넛차트 등을 활용한 직관적인 데이터 분석  
✅ **실시간 데이터 연동**: 최신 날씨 정보를 Open API를 통해 제공  
✅ **반응형 디자인**: 모바일/PC에서 모두 최적화된 UI  

---

## 🚀 기술 스택
| Frontend | Backend | 데이터 | 기타 |
|----------|---------|----------|------|
| React (TypeScript) | Node.js (Express) | 공공데이터 API | Recoil (상태 관리) |
| d3.js | MySQL | Open Weather API | sass |

---

## 🔗 데이터 출처
- [경찰청 범죄 데이터 API](https://www.data.go.kr/data/3074462/fileData.do)
- [도로교통공단 교통사고 통계 API](https://opendata.koroad.or.kr/api/selectSttDataSet.do;jsessionid=E1EA66F198B3980A9BD3C739F8D3CABC)
- [Openweather API](https://openweathermap.org/api)
