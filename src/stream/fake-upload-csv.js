import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvFilePath = new URL('tasks.csv', import.meta.url);
const ENDPOINT = 'http://localhost:3333';

async function processTasksFile() {
  const csvParse = parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true,
  });

  const fileStream = fs.createReadStream(csvFilePath);
  const streamLines = fileStream.pipe(csvParse);

  for await (const line of streamLines) {
    const [title, description] = line;
    console.log(
      'SENDING: Task title:',
      title,
      'Task description:',
      description
    );
    await fetch(`${ENDPOINT}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

processTasksFile();
