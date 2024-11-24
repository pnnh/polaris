import {initDatabase} from "@/services/worker/migration";
import {runSync} from "@/services/worker/sync";
import express, {NextFunction} from "express";
import http from "http";
import cron from "node-cron";
import {serverConfig} from "@/services/server/config";
import {personalSelectAlbums,} from "@/handlers/personal/album";
import cors from 'cors'
import {personalFetchPictureFile, personalSelectPictures} from "@/handlers/personal/pictures";
import {Request, Response} from "express";
import {personalSelectLibraries} from "@/handlers/personal/libraries";
import {findPicture, selectFromChannel, selectPicturesFromDatabase} from "@/handlers/content/pictures";
import {selectChannels} from "@/handlers/content/channels";

const workerPort = serverConfig.PORT;

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send({errors: [{message: "Something went wrong"}]});
};

function runMain() {
    // 每分钟执行一次同步
    cron.schedule("* * * * *", async () => {
        console.log("running a task every minute");
        await runSync();
    });

    const server = express();

    // 解决跨域问题
    server.use(cors({
        credentials: true,
        origin: true,
    }));

    server.use(errorHandler)

    server.get("/pictures", selectPicturesFromDatabase);
    server.get("/channels/:channel/pictures/:picture", findPicture);
    server.get("/channels/:channel/pictures", selectFromChannel);
    server.get("/channels", selectChannels);
    server.get("/personal/libraries", personalSelectLibraries);
    server.get("/personal/libraries/:library/albums", personalSelectAlbums);
    server.get("/personal/libraries/:library/albums/:album/pictures", personalSelectPictures);
    server.get("/personal/libraries/:library/albums/:album/pictures/:picture/assets/:path", personalFetchPictureFile);

    server.all("*", (req, res) => {
        res.json({code: 200});
    });

    const httpServer = http.createServer(server);

    httpServer.listen(workerPort, async () => {
        console.log(
            `Worker server is running on http://localhost:${workerPort}`,
        );
        await initDatabase();
    });
}

runSync().then(() => {
}).catch(console.error);

runMain();
