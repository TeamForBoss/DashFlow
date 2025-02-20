class DashDaemon{
    constructor(id){
        this.id = id;
        this.express = null;
        this.app = null;
        this.cors = null;
        this.path = null;
    }
    settings(){
        this.express = require("express");
        this.app = this.express();
        
        // path
        this.path = require("path");

        // cors
        this.cors = require("cors");
        this.app.use(this.cors());

        // static
        this.app.use(this.express.static("assets"));

        // json ( == bodyParser)
        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({extended:false}));
    }
    startServer(){
        const serverConfig = require(this.path.join(__dirname,"../config/server.config"));
        this.app.listen(serverConfig["port"], () => {
            console.log(`http://${serverConfig["host"]}:${serverConfig["port"]}`);
        });
    }
    registerRoutes(){
        //  * @description 유진_ home 라우트
        this.app.use("/",require(this.path.join(__dirname,"../routes/pages/homeRoute")));
        
        //  * @description 유진_ weather_api 라우트
        //  - api data 전체 가져오기
        this.app.use("/weather",require(this.path.join(__dirname,"../routes/pages/weatherRoute")));
        
        //  * @description 유진_ weather_city 라우트
        //  - 선택된 지역의 날씨 data 가져오기
        // this.app.use("/weather/city",require(this.path.join(__dirname,"../routes/pages/weatherCitiesRoute")));

        // ==========================================================
        //  * @description 정임_ 어쩌구 페이지 라우트


        // ==========================================================
        //  * @description 진아_ 어쩌구 페이지 라우트
        this.app.use("/accident",require(this.path.join(__dirname,"../routes/pages/accidentRoute")));
    }
    run(){
        this.settings();
        this.registerRoutes();
        this.startServer();
    }
}
const dashDaemon = new DashDaemon("dashDaemon")
module.exports = dashDaemon;

/* /////////////////////////////////// 
<history>

25.02.15_ 유진 기본 세팅
25.02.19_ 유진 weather api 라우팅
25.02.19_ 진아 accident 라우팅

*/ ///////////////////////////////////