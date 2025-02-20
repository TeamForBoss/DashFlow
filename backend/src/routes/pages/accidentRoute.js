const AbstractRoute = require("../base/AbstractRoute");
const ApiKey = require("../../config/api.config");

class AccidentRoute extends AbstractRoute {
    constructor(id = "") {
        super(id);
    }
    defineRoutes() {
        const fs = require("fs");
        this.router.route("/")
            // .get((req, res) => {
            //     res.send("왕왕");
            //  })
            .get((req, res) => {
                fs.readFile("./src/data/accident/test.json", (err, data) => {
                    if (err) {
                        throw err;
                    }
                    const dataObj = JSON.parse(data);
                    let { searchYearCd: lastYear, sido: sido, gugun: gugun } = dataObj;
                    console.log(lastYear);
                    res.send(`${lastYear},${sido},${gugun}`);
                });
            });
    }
    get getRoute() {
        return this.router;
    }
    run() {
        super.run();
        this.defineRoutes();
    }
}

const accidentRoute = new AccidentRoute("accidentRoute");
accidentRoute.run();

module.exports = accidentRoute.getRoute;