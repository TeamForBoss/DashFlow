// 추상클래스
// 인터페이스 설계

class AbstractRoute {
    constructor(id = "") {
        this.id = id;
        this.router = null;
    }

    initSetting() {
        this.router = require("express").Router();
    }

    defineRoutes(){
        console.log("라우트 지정 추상 메서드");
    }

    run() {
        this.initSetting();
    }
}

module.exports = AbstractRoute;
