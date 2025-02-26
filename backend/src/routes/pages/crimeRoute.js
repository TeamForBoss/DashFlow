const AbstractRoute = require("../base/AbstractRoute");
const ApiKey = require("../../config/api.config");

class CrimeRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    async fetchCrimeData() {
        // == 미들웨어 == 
        const [fs, path, axios] = [require("fs"), require("path"), require('axios')];
        
        // == File_Path == 
        const dateFilePath = path.join(__dirname, "../../data/crime/todayData_crime.json");
        const crimeFilePath = path.join(__dirname, "../../data/crime/crime_api_data.json");
        
        // == api_url ==
        const apiUrl = `https://api.odcloud.kr/api/3074462/v1/uddi:161740bd-8ec5-4734-9a3d-f7a2cde34942`;

        // == 오늘 날짜 구해오기 == 
        const now = new Date();
        const kstTimeAdd = 9 * 60 * 60 * 1000;
        const today = new Date(now.getTime() + kstTimeAdd).toISOString().split("T")[0];

        try {
            let savedDate = {};
            if (fs.existsSync(dateFilePath)) {
                const fileContent = fs.readFileSync(dateFilePath, "utf8").trim();
                if (fileContent) {
                    savedDate = JSON.parse(fileContent);
                }
            }
            if (savedDate["today"] === today) {
                console.log("[Crime] 오늘 날짜와 동일하여 API 요청 생략");
                return JSON.parse(fs.readFileSync(crimeFilePath, "utf8"));
            }

            const response = await axios.get(apiUrl,{
                    params: { page: 1, perPage: 38, serviceKey: ApiKey["open_crime"] },
                    headers: { 'Accept': "*/*" }
                }
            );

            const filterData = (data) => {
                const parsing = data.map((item) => {
                    const tempObj = {};
                    for (const key in item) {
                        if ((key === "범죄대분류") || (key === "범죄중분류") || (key.match(/경기도/)) || (key.match(/인천/)) || (key.match(/서울/))) {
                            if (!tempObj[key]) { tempObj[key] = item[key]; }
                        }
                    }
                    return tempObj;
                });
                return parsing;
            }

            // == filterData ==
            fs.writeFileSync(crimeFilePath, JSON.stringify(filterData(response["data"]["data"]), null, 2));
            fs.writeFileSync(dateFilePath, JSON.stringify({ today }, null, 2));
            return filterData(response["data"]["data"]);
        }
        catch (err) {
            console.log("[Crime] <FS_Promise_Error> " + err);
            throw err;
        }
    }

    defineRoutes() {
        this.router.route("/")
            .post(async (_req, res) => {
                console.log("[Crime] ROUTE 요청 들어옴!");
                try {
                    const data = await this.fetchCrimeData();
                    res.json(data);
                } catch (err) {
                    res.status(500).json({ error: "[Crime] 데이터 가져오기 실패", details: err.message });
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

const crimeRoute = new CrimeRoute("crimeRoute");
crimeRoute.run();

module.exports = crimeRoute.getRoute;
