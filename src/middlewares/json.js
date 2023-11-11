/**
 * Converts request body in json. Set response header to application/json.
 *
 * @param {import ('node:http').IncomingMessage} req
 * @param {import ('node:http').ServerResponse} res
 */
export async function json(req, res) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  try {
    const obj = Buffer.concat(chunks).toString();
    req.body = JSON.parse(obj);
  } catch {
    req.body = {};
  }

  res.setHeader('Content-Type', 'application/json');
}
