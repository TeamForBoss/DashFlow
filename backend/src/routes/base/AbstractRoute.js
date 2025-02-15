class AbstractRoute {
    constructor(id = "") {
        this.id = id;
        this.router = null;
    }

    initSetting() {
        this.router = require("express").Router();
        console.log(`[AbstractRoute] ${this.id} 라우트`);
    }

    defineRoutes() {
        throw new Error(`[AbstractRoute] ${this.id} - defineRoutes_method 구현 필요`);
    }

    run() {
        this.initSetting();
        this.defineRoutes();
    }
}

module.exports = AbstractRoute;
