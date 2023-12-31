import http from 'node:http';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';
import { routes } from './routes/routes.js';

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  await json(req, res);
  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = extractQueryParams(query);

    return route.handler(req, res);
  }

  res.writeHead(404).end({ status: 'error', message: 'route not found.' });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
