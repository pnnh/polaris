import {initDatabase} from "@/services/worker/migration";
import {runSync} from "@/services/worker/sync";
import express, {Request, Response, NextFunction} from "express";
import http from "http";
import cron from "node-cron";
import {serverConfig} from "@/services/server/config";
import {
    fetchArticleAssets,
    fetchArticleFile,
    findArticle,
    selectArticlesFromDatabase,
    selectFromChannel, updateArticleViewer
} from "@/handlers/articles/articles";
import {fetchChannelFile, selectChannels} from "@/handlers/channels/channels";
import {selectLibraries} from "@/handlers/personal/libraries/libraries";
import {selectNotebooks} from "@/handlers/personal/notebook";
import {selectNotes, updateNote} from "@/handlers/personal/note";
import cors from 'cors'
import stripAnsi from "strip-ansi";
import {accountInformation} from "@/handlers/account/information";
import {selectTagsFromDatabase} from "@/handlers/tags/tags";
import {commentInsertHandler, commentsHandler} from "@/handlers/comments/comments";

const workerPort = serverConfig.PORT;

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
    server.use(express.json());

    server.get("/", handleErrors(sayHello));
    server.get("/account/information", handleErrors(accountInformation));
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
    server.get("/comments", handleErrors(commentsHandler));
    server.post("/comments", handleErrors(commentInsertHandler));

    server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        const message = stripAnsi(err.stack || err.message || 'Unknown error')
        res.status(500).send({
            code: 500,
            message: message
        })
    })

    const httpServer = http.createServer(server);

    httpServer.listen(workerPort, async () => {
        console.log(
            `Worker server is running on http://0.0.0.0:${workerPort}`,
        );
        await initDatabase();
    });
}

runSync().then(() => {
}).catch(console.error);

runMain();
