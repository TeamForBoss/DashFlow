class DashDaemon{
    constructor(id){
        this.id = id;
        this.express = null;
        this.app = null;
        this.path = require("path");
    }
    settings(){
        this.express = require("express");
        this.app = this.express();

        const listenPort = () => {
            const serverConfig = require(this.path.join(__dirname,"../config/server.config"));
            this.app.listen(serverConfig["port"], () => {
                console.log(`http://${serverConfig["host"]}:${serverConfig["port"]}`);
            });
        }
        listenPort();
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
    }
}
const dashDaemon = new DashDaemon("dashDaemon")
module.exports = dashDaemon;

/* /////////////////////////////////// 
<history>

25.02.15_ 유진 기본 세팅


*/ ///////////////////////////////////