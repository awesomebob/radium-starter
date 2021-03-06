'use strict';

import koa from 'koa';
import convert from 'koa-convert';
import rewrite from 'koa-rewrite';
import staticCache from 'koa-static-cache';

export class Server {
  constructor(app, options = {}) {
    this.app = app;
    this.path = options.path;
    this.port = options.port;
  }

  start() {
    let root = new koa();
    root.name = this.app.name;
    root.proxy = true;

    root.use(convert(rewrite('/', '/index.html')));

    let development = this.app.environment === 'development';
    root.use(convert(staticCache(this.path, {
      buffer: !development,
      gzip: !development,
      dynamic: development
    })));

    root.listen(this.port, () => {
      console.log('RadiumStarter demo started on http://localhost:' + this.port);
    });
  }
}

export default Server;
