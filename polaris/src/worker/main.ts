
import express, {Request, Response, NextFunction} from "express";
import http from "http";
import cron from "node-cron";
import cors from 'cors'
import stripAnsi from "strip-ansi";
import {initDatabase} from "@/worker/migration";
import {runSync} from "@/worker/sync";
import {
    fetchArticleAssets, fetchArticleFile,
    findArticle,
    selectArticlesFromDatabase, selectFromChannel,
    updateArticleViewer
} from "@/worker/handlers/articles";
import {selectTagsFromDatabase} from "@/worker/handlers/tags";
import {fetchChannelFile, selectChannels} from "@/worker/handlers/channels";
import {selectLibraries} from "@/worker/handlers/personal/libraries/libraries";
import {selectNotebooks} from "@/worker/handlers/personal/notebook";
import {selectNotes, updateNote} from "@/worker/handlers/personal/note";
import * as dotenv from 'dotenv'


function handleErrors(
    handlerFunc: (request: Request, response: Response) => Promise<Response<any, Record<string, any>> | undefined | void>) {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handlerFunc(req, res);
        } catch (e) {
            next(e);
        }
    }
}

export async function sayHello(
    request: Request,
    response: Response,
) {

    response.json({
        code: 200,
        message: "Hello, World!",
    })
}

async function runMain() {
    dotenv.config({
        path: `.env.${process.env.NODE_ENV || 'development'}`
    })

    // 每分钟执行一次同步
    cron.schedule("0/5 * * * *", async () => {
        console.log("running a task every minute");
        await runSync();
    });

    const server = express();

    // 解决跨域问题
    server.use(cors({
        credentials: true,
        origin: true,
    }));
    server.use(express.json());

    server.get("/", handleErrors(sayHello));
    server.get("/articles", handleErrors(selectArticlesFromDatabase));
    server.get("/tags", handleErrors(selectTagsFromDatabase));
    server.post("/articles/:article/viewer", handleErrors(updateArticleViewer));
    server.get("/channels/:channel/articles/:article", handleErrors(findArticle));
    server.get("/channels/:channel/articles/:article/assets", handleErrors(fetchArticleAssets));
    server.get("/channels/:channel/articles/:article/assets/:asset", handleErrors(fetchArticleFile));
    server.get("/channels/:channel/articles", handleErrors(selectFromChannel));
    server.get("/channels", handleErrors(selectChannels));
    server.get("/channels/:channel/assets/:asset", handleErrors(fetchChannelFile));
    server.get("/personal/libraries", handleErrors(selectLibraries));
    server.get("/personal/libraries/:library/notebooks", handleErrors(selectNotebooks));
    server.get("/personal/libraries/:library/notebooks/:notebook/notes", handleErrors(selectNotes));
    server.put("/personal/libraries/:library/notebooks/:notebook/notes/:note", handleErrors(updateNote));

    server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        const message = stripAnsi(err.stack || err.message || 'Unknown error')
        res.status(500).send({
            code: 500,
            message: message
        })
    })

    const httpServer = http.createServer(server);
    const workerPort = 7101

    await initDatabase();
    await runSync();

    httpServer.listen(workerPort, async () => {
        console.log(
            `Worker server is running on http://0.0.0.0:${workerPort}`,
        );
    });
}

runMain().then(() => console.log('EXIT')).catch((e) => console.error(e));
