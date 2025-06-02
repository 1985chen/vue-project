// server/index.js
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

// 获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log([import.meta,import.meta.url,__filename,__dirname],'__filename,__dirname999')

// 配置日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 配置
const config = {
  apiPort: process.env.API_PORT || 3030,
  staticPort: process.env.STATIC_PORT || 8080,
  staticPath: path.join(__dirname, '../dist')
};
console.log(config,process.env,'config')

// 创建应用实例
const app = new Koa();
const router = new Router();

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Server Error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status
      }
    };
  }
});

// 请求日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 使用中间件
app.use(cors());
app.use(bodyParser());

// API 路由
router.get('/api/message', (ctx) => {
  ctx.body = { message: 'Hello from Koa!' };
});

// 注册路由
app.use(router.routes()).use(router.allowedMethods());

// 静态文件服务
app.use(serve(config.staticPath));

// 启动服务器
const server = app.listen(config.apiPort, () => {
  logger.info(`Server is running on http://localhost:${config.apiPort}`);
}).on('error', (err) => {
  logger.error('Server failed to start:', err);
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
