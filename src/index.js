// @flow

import 'babel-polyfill';

import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import serve from 'koa-static';
import middleware from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import _ from 'lodash';
import methodOverride from 'koa-methodoverride';
import rollbar from 'rollbar';
import dotenv from 'dotenv';

import getWebpackConfig from '../webpack.config.babel';
import addRoutes from './controllers';
import container from './container';

export default () => {
  const app = new Koa();
  dotenv.config();
  rollbar.init(process.env.ROLLBAR_TOKEN);
  app.keys = ['some secret hurr'];
  app.use(session(app));
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
    };
    await next();
  });
  app.use(bodyParser());
  /* eslint-disable */
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method;
    }
  }));
  /* eslint-enable */
  app.use(serve(path.join(__dirname, '..', 'public')));
  app.use(middleware({
    config: getWebpackConfig(),
  }));

  app.use(koaLogger());
  const router = new Router();
  addRoutes(router, container);
  app.use(router.routes());
  app.use(router.allowedMethods());

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);
  app.on('error', (err) => {
    rollbar.handleError(err);
  });
  return app;
};
