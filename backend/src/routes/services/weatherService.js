const AbstractRoute = require("../base/AbstractRoute");

class WeatherServiceRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    filterWeatherInfo(city = "", res) {
        // == 미들웨어 ==
        const [fs, path] = [require("fs"), require("path")];
        // == File_Path ==
        const weatherDataPath = path.join(__dirname,"../../data/weather/weather_api_data.json");

        fs.readFile(weatherDataPath,(err,data)=>{
            if (err) throw err;
            const AllData = JSON.parse(data);
            const filterData = AllData.filter((item)=>{
                return item["city"] === city;
            });
            res.json(filterData);
        });
    }

    defineRoutes() {
        this.router.route("/")
            .post((req, res) => {
                const { city } = req.body;
                //터미널 출력
                console.log(req.body)
                console.log(`[Weather_Service] city: ${city} 요청`);
                this.filterWeatherInfo(city, res);
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

const weatherService = new WeatherServiceRoute("weatherService");
weatherService.run();

module.exports = weatherService.getRoute;

