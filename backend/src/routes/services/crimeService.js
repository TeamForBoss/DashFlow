const AbstractRoute = require("../base/AbstractRoute");

class CrimeServiceRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    filterCrimeInfo(city = "", res) {
        // == 미들웨어 ==
        const [fs, path, mysql] = [require("fs"), require("path"), require("mysql")];

        // == 환경설정_파일 ==
        const [dbConfig, queries] = [
            require("../../config/db.config"),
            require("../../sqlTemplate/region_info_queries")
        ];

        // == File_Path ==
        const crimeDataPath = path.join(__dirname, "../../data/crime/crime_api_data.json");

        // == DB_connection ==
        const connection = mysql.createConnection(dbConfig);
        connection.connect();

        connection.query(queries["crime"], [city], (err, rows) => {
            const { id, city_ko, sido_ko } = rows[0];
            // 터미널 출력
            console.log(`[Crime_Service] city: ${city} 요청 / [DB_Row] id: ${id}, city_ko: ${city_ko}`);

            fs.readFile(crimeDataPath, (err, data) => {
                if (err) throw err;

                const AllData = JSON.parse(data); // readFile 반환 data 파싱
                const filterObejct = { city: city, crimeData: [] } // 보낼 데이터 형식 지정

                AllData.forEach((item) => {
                    const tempObj = {data:0, 범죄대분류:"", 범죄중분류: ""}
                    for (const key in item) {
                        if (key.match(city_ko) && key.match(sido_ko)){tempObj["data"] = item[key]}
                        if (key === "범죄대분류"){tempObj["범죄대분류"] = item[key]}
                        if (key === "범죄중분류"){tempObj["범죄중분류"] = item[key]}
                    }
                    filterObejct["crimeData"].push(tempObj);
                }); // forEach
                res.json(filterObejct); // json보내기기
            }); // readFile
        }); // connection
        connection.end();
    }// END_filterCrimeInfo

    defineRoutes() {
        this.router.route("/")
            .post((req, res) => {
                const { city } = req.body;
                this.filterCrimeInfo(city, res);
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

const crimeService = new CrimeServiceRoute("crimeService");
crimeService.run();

module.exports = crimeService.getRoute;

