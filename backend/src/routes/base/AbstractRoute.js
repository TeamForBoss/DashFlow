// 추상클래스
// 인터페이스 설계

class AbstractRoute {
    constructor(id = "") {
        this.id = id;
        this.express = null;
        this.app = null;
        this.router = null;
    }

    initSetting() {
        this.express = require("express");
        this.app = this.express();
        this.router = this.express.Router();
        console.log(`[AbstractClass] ${this.id} 라우트`);
    }

    defineRoutes() {
        console.error(`[AbstractClass] ${this.id} - defineRoutes_method 구현 필요!`);
    }

    get getRoute(){
        if (!this.router) {
            console.error(`[AbstractClass] ${this.id} - router가 초기화되지 않았음!`);
            return null;
        }
        return this.router;
    }

    run() {
        this.initSetting();
        this.defineRoutes();
    }
}

module.exports = AbstractRoute;
