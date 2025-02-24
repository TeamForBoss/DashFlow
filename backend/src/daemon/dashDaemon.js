class DashDaemon {
    constructor(id) {
        this.id = id;
        this.express = null;
        this.app = null;
        this.cors = null;
        this.path = null;
    }
    settings() {
        this.express = require("express");
        this.app = this.express();

        // path
        this.path = require("path");

        // cors
        this.cors = require("cors");
        this.app.use(this.cors());

        // json ( == bodyParser)
        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({ extended: false }));
    }
    startServer() {
        const serverConfig = require(this.path.join(__dirname, "../config/server.config"));
        this.app.listen(serverConfig["port"], () => {
            console.log(`http://${serverConfig["host"]}:${serverConfig["port"]}`);
        });
    }
    registerRoutes() {
        //  * @description 유진_ home 라우트
        this.app.use("/", require(this.path.join(__dirname, "../routes/pages/homeRoute")));

        //  ====== [API_호출] ======
        this.app.use("/weather", require(this.path.join(__dirname, "../routes/pages/weatherRoute")));
        this.app.use("/accident", require(this.path.join(__dirname, "../routes/pages/accidentRoute")));
        this.app.use("/crime", require(this.path.join(__dirname, "../routes/pages/crimeRoute")));

        //  ====== [JSON_필요 데이터 반환] ======
        //  * @description weather_city 라우트
        this.app.use("/weather/city", require(this.path.join(__dirname, "../routes/services/weatherService")));
        this.app.use("/accident/city", require(this.path.join(__dirname, "../routes/services/accidentService")));
        this.app.use("/crime/city", require(this.path.join(__dirname, "../routes/services/crimeService")));

    }
    run() {
        this.settings();
        this.registerRoutes();
        this.startServer();
    }
}
const dashDaemon = new DashDaemon("dashDaemon")
module.exports = dashDaemon;
