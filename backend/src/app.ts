import express, { Express } from "express";
import { Request, Response } from "express";

class DashDaemon {
    protected id: string;
    public express: typeof express; 
    public app: Express | null; 
    constructor(id: string) {
        this.id = id;
        this.express = express;
        this.app = null;
    }
    settings(): void {
        this.app = this.express();
        // static
        this.app.use(this.express.static("assets"));

        //json
        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({extended:true}));

        this.listenPort();
    }
    listenPort(): void{
        const PORT: number = 5000;
        this.app?.listen(PORT,()=>{
            console.log(`http://localhost:${5000}`);
        });
    }
    setupRoutes(): void{
        this.app?.get("/", (_req: Request, res: Response) => {
            res.send("Server is running on port 5000!");
        });
    }
    run(): void{
        this.settings();
        this.setupRoutes();
    }
}

export default DashDaemon;
