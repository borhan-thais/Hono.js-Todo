import { Hono } from 'hono';
import { readFile, writeFile } from 'node:fs/promises';
import { serve } from '@hono/node-server';
const app = new Hono();

app.get('/', (c) => {
  try {
    c.json({ root: true })
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.get('/todos/', async (c) => {
  try {
    const fileContent = await readFile('content.json', 'utf8');
    return c.text(fileContent);
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/todos', async (c) => {
  try {
    const body = await c.req.text();
    const array = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    const fileContent = await readFile('content.json', 'utf8');
    const todosList = JSON.parse(fileContent);
    const idno = array[0];
    const Name = array[1];
    const Status = array[2];
    const newTodo = { idno, Name, Status };
    todosList.push(newTodo);
    await writeFile('content.json', JSON.stringify(todosList), 'utf8');
    return c.text('saved successfully');
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/todos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const fileContent = await readFile('content.json', 'utf8');
    const todosList = JSON.parse(fileContent);
    const updatedWork = todosList.filter((element) => element.idno != id);
    await writeFile('content.json', JSON.stringify(updatedWork), 'utf8');
    return c.text(`${id} Deleted Succesfully ${JSON.stringify(updatedWork)}`);
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/todos', async (c) => {
  try {
    await writeFile('content.json', JSON.stringify([]), 'utf8');
    return c.text('Cleared all data succesfully');
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/todos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.text();
    const fileContent = await readFile('content.json', 'utf8');
    const todosList = JSON.parse(fileContent);
    todosList.map((element) => {
      if (element.idno === id) element.Status = body;
    });
    await writeFile('content.json', JSON.stringify(todosList), 'utf8');
    return c.text(`${id} Updated Succesfully ${JSON.stringify(todosList)}`);
  } catch {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.notFound((c) => c.text('Not Found', 404));
const port = 3000;
console.log(`listening on port ${port}`);
export default {
  port,
  fetch: app.fetch,
};

serve({
  fetch: app.fetch,
  port,
});
