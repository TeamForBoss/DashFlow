const AbstractRoute = require("../base/AbstractRoute");

class AccidentServiceRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    async filterAccidentInfo(city = "", res) {
        const fs = require("fs").promises;
        const path = require("path");
        
        const searchYear = [ 2023 ];

        let allFilteredData = [];

        for (const year of searchYear) {
            const accidentFilePathYear = path.join(__dirname, `../../data/accident/accident_api_data_${year}.json`);
            try {
                const data = await fs.readFile(accidentFilePathYear, "utf8");
                const jsonData = JSON.parse(data);
                const filtered = jsonData.filter(item => item["city"] === city);
                allFilteredData = allFilteredData.concat(filtered);
            } catch (error) {
                console.error(`[Accident_Service] 파일 읽기 실패 (연도: ${year}):`, error.message);
            }
        }
        res.json(allFilteredData);
    }

    defineRoutes() {
        this.router.route("/")
            .post(async (req, res) => {
                const { city } = req.body;
                console.log(`[Accident_Service] city: ${city} 요청`);
                await this.filterAccidentInfo(city, res);
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

const accidentService = new AccidentServiceRoute("accidentService");
accidentService.run();

module.exports = accidentService.getRoute;
