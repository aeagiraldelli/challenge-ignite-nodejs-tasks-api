import fs from 'node:fs/promises';

const DB_PATH = new URL('db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    this.#load();
  }

  select(table, filter) {
    let data = this.#database[table] ?? [];
    if (filter) {
      data = data.filter((row) => {
        return Object.entries(filter).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  selectById(table, id) {
    if (this.#database[table] && this.#database[table].length > 0) {
      const task = this.#database[table].find(
        (row) => Number(row.id) === Number(id)
      );
      return task;
    } else {
      return {};
    }
  }

  insert(table, data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    data.completed_at = null;

    if (Array.isArray(this.#database[table])) {
      data.id = this.#database[table].length + 1;
      this.#database[table].push(data);
    } else {
      data.id = 1;
      this.#database[table] = [data];
    }

    this.#save();

    return data.id;
  }

  update(table, id, data) {
    if (this.#database[table]) {
      const rowIndex = this.#database[table].findIndex(
        (row) => Number(row.id) === Number(id)
      );

      if (rowIndex > -1) {
        data.updated_at = new Date();
        data.created_at = this.#database[table][rowIndex].created_at;
        data.completed_at = this.#database[table][rowIndex].completed_at;

        this.#database[table][rowIndex] = { id: Number(id), ...data };

        this.#save();
      }
    }
  }

  completeTask(table, id) {
    if (this.#database[table]) {
      const rowIndex = this.#database[table].findIndex(
        (row) => Number(row.id) === Number(id)
      );

      if (rowIndex > -1) {
        const completed_at = this.#database[table][rowIndex].completed_at;
        if (!completed_at) {
          this.#database[table][rowIndex].completed_at = new Date();
          this.#save();
        }
      }
    }
  }

  delete(table, id) {
    if (this.#database[table] && this.#database[table].length > 0) {
      const rowIndex = this.#database[table].findIndex(
        (row) => Number(row.id) === Number(id)
      );

      if (rowIndex > -1) {
        this.#database[table].splice(rowIndex, 1);
        this.#save();
      }
    }
  }

  #save() {
    fs.writeFile(DB_PATH, JSON.stringify(this.#database));
  }

  #load() {
    fs.readFile(DB_PATH)
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch((error) => {
        this.#save();
      });
  }
}
