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
        
        //  * @description 유진_ 어쩌구 페이지 라우트

        //  * @description 정임_ 어쩌구 페이지 라우트

        //  * @description 진아_ 어쩌구 페이지 라우트
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


*/ ///////////////////////////////////