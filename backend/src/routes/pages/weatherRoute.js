const AbstractRoute = require("../base/AbstractRoute");
const ApiKey = require("../../config/api.config");

class WeatherRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }
    fetchWeatherData() {
        const [fs, path, axios] = [require("fs"), require("path"), require('axios')];

        const apiUrl = (latitude, longitude) => {
            return `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${ApiKey["open_weather"]}&units=metric`;
        }
        
        fs.readFile(path.join(__dirname, "../../data/weather/TodayDate_data.json"), (err, data) => {
            if (err) throw err;
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];

            if ((data == "") || (JSON.parse(data)["today"] !== formattedDate)) {
                console.log(`[Weather] <${formattedDate}> - JSON_DATA 다시 작성!`);
                
                fs.writeFile(path.join(__dirname, "../../data/weather/TodayDate_data.json"), JSON.stringify({ "today": formattedDate }), (err) => {
                    if (err) throw err;
                });

                fs.readFile(path.join(__dirname, "../../data/weather/city_coordinates.json"), (err, coordiData) => {
                    if (err) throw err;
                    const coordinates = JSON.parse(coordiData);
                    const weatherDataArray = [];
                    const promises = []; // 요청을 저장할 배열

                    for (const city in coordinates) {
                        const { latitude, longitude, id} = coordinates[city];

                        // == axios 요청 ==
                        const promise = axios.get(apiUrl(latitude,longitude))
                            .then((response) => {
                                weatherDataArray.push({id: id, city: city, data: response["data"]});
                            })
                            .catch((err) => {
                                console.log("[Weather] <Fetch_Error> " + err);
                            });
                        promises.push(promise); // 배열에 추가
                    }

                    // 모든 요청이 완료된 후에 파일 쓰기
                    Promise.all(promises)
                        .then(() => {
                            fs.writeFile(path.join(__dirname, "../../data/weather/weather_data.json"), JSON.stringify(weatherDataArray), (err) => {
                                if (err) throw err;
                                console.log("[Weather] WriteFile_Done!");
                            });
                        })
                        .catch((err) => {
                            console.log("[Weather] <FS_Promise_Error> " + err);
                        });
                });
            }
        });
    }

    defineRoutes() {
        this.router.route("/")
            .post((_req, res) => {
                console.log("[Weather] ROUTE 요청들어옴!");
                res.send("DONE");
                this.fetchWeatherData();
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

const weatherRoute = new WeatherRoute("weatherRoute");
weatherRoute.run();

module.exports = weatherRoute.getRoute;
