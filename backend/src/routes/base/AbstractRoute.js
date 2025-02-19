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

    run() {
        this.initSetting();
    }
}

module.exports = AbstractRoute;
