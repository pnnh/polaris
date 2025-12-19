import express, {NextFunction, Request, Response} from "express";
import http from "http";
import cors from 'cors'
import stripAnsi from "strip-ansi";
import path from 'node:path'

const workerPort = process.env.PORT || 7100;

type HandlerFunc = (request: Request, response: Response) => Promise<Response<any, Record<string, any>> | undefined | void>;

function handleErrors(handlerFunc: HandlerFunc) {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handlerFunc(req, res);
        } catch (e) {
            next(e);
        }
    }
}

async function healthCheck(
    request: Request,
    response: Response,) {
    response.status(200).send({
        code: 200,
        message: 'ok'
    })
}

function runMain() {
    const server = express();

    // 解决跨域问题
    server.use(cors({
        credentials: true,
        origin: true,
    }));
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));

    server.get('/polaris/healthz', handleErrors(healthCheck));

    const cwd = process.cwd();
    server.use(express.static(path.join(cwd, 'public')));

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
    });
}

runMain();
