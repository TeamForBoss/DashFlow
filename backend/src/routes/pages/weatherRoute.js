const AbstractRoute = require("../base/AbstractRoute");

class WeatherRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }

    fetchWeatherData(res) {
        // == 미들웨어 ==
        const [fs, path, axios, mysql] = [require("fs"), require("path"), require('axios'), require("mysql")];
        
        // == 환경설정_파일 ==
        const [ApiKey, dbConfig, queries ] = [
            require("../../config/api.config"),
            require("../../config/db.config"),
            require("../../sqlTemplate/gyeonggi_info_queries")
        ];

        // == DB_connection ==
        const connection = mysql.createConnection(dbConfig);

        // == File_Path ==
        const [apiDataFilePath, todayDataFilePath] = [path.join(__dirname, "../../data/weather/weather_api_data.json"), path.join(__dirname, "../../data/weather/todayData_weather.json")];
        
        // == api_url 반환 함수 ==
        const apiUrl = (latitude, longitude) => {
            return `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${ApiKey["open_weather"]}&units=metric`;
        }

        // == File_Data_JSON 반환 함수 ==
        const sendFileData = (res, filePath) => {
            fs.readFile(filePath, (err, fileData) => {
                if (err) throw err;
                res.json(JSON.parse(fileData));
            });
        }

        fs.readFile(todayDataFilePath, (err, data) => {
            if (err) throw err;
            
            // == 오늘 날짜 구해오기 == 
            const now = new Date();
            const kstTimeAdd = 9 * 60 * 60 * 1000;
            const today = new Date(now.getTime() + kstTimeAdd).toISOString().split("T")[0];

            if ((data == "") || (JSON.parse(data)["today"] !== today)) {
                console.log(`[Weather] <${today}> - JSON_DATA 다시 작성!`);

                fs.writeFile(todayDataFilePath, JSON.stringify({ "today": today }), (err) => {
                    if (err) throw err;
                });

                connection.connect();
                connection.query(queries["weather"],(err, rows) => {
                    if (err) throw err;
                    const dbData = rows;
                    // console.log(rows)
                    const [weatherDataArray, promises] = [[],[]]; // 요청 저장할 배열
                    dbData.forEach((row) => {
                        const { lat, lon, id, city_en } = row;

                        // == axios 요청 ==
                        const promise = axios.get(apiUrl(lat, lon))
                            .then((response) => {
                                weatherDataArray.push({ city: city_en, data: response["data"] });
                            })
                            .catch((err) => {
                                console.log("[Weather] <Fetch_Error> " + err);
                            });
                        promises.push(promise); // 배열에 추가
                    });

                    // 모든 요청이 완료된 후에 파일 쓰기
                    Promise.all(promises)
                        .then(() => {
                            fs.writeFile(apiDataFilePath, JSON.stringify(weatherDataArray), (err) => {
                                if (err) throw err;
                                console.log("[Weather] WriteFile_Done!");
                                sendFileData(res, apiDataFilePath);
                            });
                        })
                        .catch((err) => {
                            console.log("[Weather] <FS_Promise_Error> " + err);
                        });
                });
                connection.end();
            } else {
                console.log("[Weather] 오늘 날짜와 동일하여 API 요청 생략");
                sendFileData(res, apiDataFilePath);
            }
        });
    }

    defineRoutes() {
        this.router.route("/")
            .post((_req, res) => {
                console.log("[Weather] ROUTE 요청들어옴!");
                this.fetchWeatherData(res);
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
