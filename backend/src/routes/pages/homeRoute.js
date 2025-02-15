const AbstractRoute = require("../base/AbstractRoute");

class HomeRoute extends AbstractRoute{
    constructor(id = ""){
        super(id);
    }
    defineRoutes(){
        this.router.route("/")
        .get((_req,res)=>{
            res.send("🚀 Welcome aboard! This is the home page. 🏡");
        });
    }
    get getRoute() {
        return this.router;
    }
    run(){
        super.run();
        this.defineRoutes();
    }
}

const homeRoute = new HomeRoute("homeRoute");
homeRoute.run();

module.exports = homeRoute.getRoute;