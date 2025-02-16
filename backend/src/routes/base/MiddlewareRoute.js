// 추가 미들웨어가 필요한경우 인터페이스 확장

const AbstractRoute = require("./AbstractRoute");

class MiddlewareRoute extends AbstractRoute{
    constructor(id){
        super(id);
    }
    setMiddlewares(){
        console.log(`[MiddlewareRoute_Class] ${this.id} - 미들웨어 설정 필요!`);
    }
    run(){
        this.setMiddlewares();
        super.run();
    }
}

module.exports = MiddlewareRoute;