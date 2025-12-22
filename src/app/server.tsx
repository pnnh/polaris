import express, {NextFunction, Request, Response} from "express";
import http from "http";
import cors from 'cors'
import stripAnsi from "strip-ansi";
import {HandleHomePage} from "@/app/page";
import {HandleSitemap} from "@/app/polaris/sitemap/route";

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


function proxyHeader(request: Request, response: Response) {

    // 返回该请求头以指示浏览器在后续请求头中附带sec-ch-prefers-color-scheme头以便获取用户的主题偏好
    // response.headers.set('Accept-CH', 'Sec-CH-Prefers-Color-Scheme')
    // // 设置COEP和COOP以启用跨源隔离，这两个头在使用SQLite时需要
    // response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    // response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    //
    // return response;
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
    server.get('/polaris/sitemap', HandleSitemap)

    server.get('/', HandleHomePage);
    // const cwd = process.cwd();
    // server.use(express.static(path.join(cwd, 'public')));

    // 附加额外响应头
    server.use(proxyHeader)
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
