// 추가 미들웨어가 필요한경우 인터페이스 확장
const AbstractRoute = require("./AbstractRoute");

class MiddlewareEnhancer extends AbstractRoute{
    constructor(id){
        super(id);
    }
    applyMiddleware(){
        console.log(`[MiddlewareEnhancer_Class] ${this.id} - 미들웨어 설정 필요!`);
    }
    run(){
        this.applyMiddleware();
        super.run();
    }
}

module.exports = MiddlewareEnhancer;