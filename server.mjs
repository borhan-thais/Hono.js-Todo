import { Hono } from "hono";
import { readFile, writeFile } from "node:fs/promises";
import { serve } from "@hono/node-server";
const app = new Hono();

app.get("/", (c) => c.json({ root: true }));
app.get("/file", async (c) => {
  const fileContent = await readFile("content.json", "utf8");
  return c.text(fileContent);
});

app.post("/file", async (c) => {
  const body = await c.req.text();
  const array = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const fileContent = await readFile("content.json", "utf8");
  const listOfWork = JSON.parse(fileContent);
  const idno = array[0];
  const Name = array[1];
  const Status = array[2];
  const newWork = { idno, Name, Status };
  listOfWork.push(newWork);
  await writeFile("content.json", JSON.stringify(listOfWork), "utf8");
  return c.text("saved successfully");
});

app.delete("/del/:id", async (c) => {
  const id = c.req.param("id");
  const fileContent = await readFile("content.json", "utf8");
  const listOfWork = JSON.parse(fileContent);
  const updatedWork = listOfWork.filter((element) => element.idno != id);
  await writeFile("content.json", JSON.stringify(updatedWork), "utf8");
  return c.text(`${id} Deleted Succesfully ${JSON.stringify(updatedWork)}`);
});
app.delete("/emptydata", async (c) => {
  await writeFile("content.json", JSON.stringify([]), "utf8");
  return c.text("Cleared all data succesfully");
});
app.put("/update", async (c) => {
  const body = await c.req.text();
  const array = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const fileContent = await readFile("content.json", "utf8");
  const listOfWork = JSON.parse(fileContent);
  const id = array[0];
  listOfWork.map((element) => {
    if (element.idno === id) element.Status = array[1];
  });
  await writeFile("content.json", JSON.stringify(listOfWork), "utf8");
  return c.text(`${id} Updated Succesfully ${JSON.stringify(listOfWork)}`);
});
app.notFound((c) => c.text("Not Found", 404));
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
