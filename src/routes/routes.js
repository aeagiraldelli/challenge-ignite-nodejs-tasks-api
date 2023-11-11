import { Database } from '../database/database.js';
import { buildRoutePath } from '../utils/build-route-path.js';

const db = new Database();
const TASK_TABLE = 'tasks';

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = db.select(TASK_TABLE, {
        title: search ?? '',
        description: search ?? '',
      });

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params ?? '';
      if (id) {
        const task = db.selectById(TASK_TABLE, id);
        if (task) {
          return res.end(JSON.stringify(task));
        } else {
          return res.writeHead(404).end();
        }
      } else {
        return res.writeHead(400).end();
      }
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (req.body) {
        const { title, description } = req.body;
        if (!title) {
          return res.writeHead(400).end(
            JSON.stringify({
              status: 'error',
              message: 'title can not be empty.',
            })
          );
        }

        if (!description) {
          return res.writeHead(400).end(
            JSON.stringify({
              status: 'error',
              message: 'description can not be empty.',
            })
          );
        }

        const task = { title, description };
        db.insert(TASK_TABLE, task);
        return res.writeHead(201).end();
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            status: 'error',
            message: 'title can not be empty.',
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            status: 'error',
            message: 'description can not be empty.',
          })
        );
      }

      db.update(TASK_TABLE, id, { title, description });
      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      console.log(id);
      if (id) {
        const task = db.selectById(TASK_TABLE, id);
        if (task && task.id) {
          db.delete(TASK_TABLE, id);
          return res.writeHead(204).end();
        } else {
          return res
            .writeHead(404)
            .end(
              JSON.stringify({ status: 'error', message: 'task not found.' })
            );
        }
      } else {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ status: 'error', message: 'id can not be empty' })
          );
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      let task = db.selectById(id);
      if (task && !task.completed_at) {
        db.completeTask(TASK_TABLE, id);
        res.writeHead(204).end();
      } else {
        res
          .writeHead(400)
          .end(JSON.stringify({ status: 'error', message: 'task not found.' }));
      }
    },
  },
];
