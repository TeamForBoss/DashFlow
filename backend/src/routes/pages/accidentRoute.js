const AbstractRoute = require("../base/AbstractRoute");

class AccidentRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    async fetchAccidentData() {
        // 미들웨어 설정
        const fs = require("fs");
        const path = require("path");
        const axios = require("axios");
        const xml2js = require("xml2js");
        const mysql = require("mysql2/promise");

        // 환경설정 파일 불러오기
        const [ApiKey, dbConfig, queries] = [
            require("../../config/api.config"),
            require("../../config/db.config"),
            require("../../sqlTemplate/gyeonggi_info_queries")
        ];

        const cacheFilePath = path.join(__dirname, "../../data/accident/currentYear_accident.json");

        // API URL 생성 함수
        const apiUrl = (year, code) => {
            return `https://opendata.koroad.or.kr/data/rest/stt?authKey=${ApiKey["open_accident"]}&searchYearCd=${year}&sido=1300&gugun=${code}`;
        };

        try {
            const now = new Date();
            const kstTimeAdd = 9 * 60 * 60 * 1000;
            const currentYear = new Date(now.getTime() + kstTimeAdd).getFullYear();

            let cachedData = {};
            if (fs.existsSync(cacheFilePath)) {
                const fileContent = fs.readFileSync(cacheFilePath, "utf8").trim();
                if (fileContent) cachedData = JSON.parse(fileContent);
            }

            const searchYear = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
            if (cachedData["year"] === currentYear) {
                console.log(`[Accident] 현재 연도(${currentYear})와 동일하여 API 요청 생략`);
                const allAccidentData = {};
                for (const year of searchYear) {
                    const filePath = path.join(__dirname, `../../data/accident/accident_api_data_${year}.json`);
                    if (fs.existsSync(filePath)) {
                        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                        allAccidentData[year] = data;
                    }
                }
                return allAccidentData;
            }

            // DB 연결 및 질의 수행
            const connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute(queries["accident"]);
            await connection.end();

            const parser = new xml2js.Parser();
            const allAccidentData = {};

            // 년도별로 순차적으로 API 호출
            for (const year of searchYear) {
                const accidentDataArrForYear = [];
                for (const row of rows) {
                    const { city_en, accident_code } = row;
                    try {
                        const response = await axios.get(apiUrl(year, accident_code));
                        const result = await parser.parseStringPromise(response.data);
                        let {response: { header, body: [{ items: [obj] }] }} = result;
                        accidentDataArrForYear.push({ city: city_en, data: obj });
                    } catch (error) {
                        console.log(`[Accident] API 요청 실패: ${accident_code} (년도: ${year}), 오류:`, error.message);
                    }
                }
                // 년도별 결과 저장
                const accidentFilePathYear = path.join(__dirname, `../../data/accident/accident_api_data_${year}.json`);
                fs.writeFileSync(accidentFilePathYear, JSON.stringify(accidentDataArrForYear, null, 2));
                allAccidentData[year] = accidentDataArrForYear;
            }

            fs.writeFileSync(cacheFilePath, JSON.stringify({ year: currentYear }, null, 2));
            return allAccidentData;
            
        } catch (err) {
            console.log("[Accident] <FS_Promise_Error> " + err);
            throw err;
        }
    }

    defineRoutes() {
        this.router.route("/")
            .post(async (req, res) => {
                console.log("[Accident] ROUTE 요청 들어옴!");
                try {
                    const data = await this.fetchAccidentData();
                    res.json(data);
                } catch (err) {
                    res.status(500).json({ error: "[Accident] 데이터 가져오기 실패", message: err.message });
                }
            });
    }

    get getRoute() {
        return this.router;
    }

    run() {
        super.run();
        this.defineRoutes();
    }
}

const accidentRoute = new AccidentRoute("accidentRoute");
accidentRoute.run();

module.exports = accidentRoute.getRoute;
