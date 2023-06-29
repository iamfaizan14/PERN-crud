import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

//MIDDLEWARES//
app.use(cors());
app.use(express.json());

//ROUTES//
//CREATE TODO
app.post("/create-todo", async (req, res) => {
  try {
    const { description } = req.body;
    // console.log(description)
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows);
  } catch (error) {
    console.log(error);
  }
});

//GET TODOS
app.get("/get-todo", async (req, res) => {
  try {
    // const { description } = req.body;
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error);
  }
});

//GET SINGLE TODO
app.get("/get-todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
    res.json(todo.rows);
  } catch (error) {
    console.log(error);
  }
});

//UPDATE TODO
app.put("/update-todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const todo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json(todo.rows);
  } catch (error) {
    console.log(error);
  }
});

//UPDATE TODO
app.delete("/delete-todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      "DELETE FROM todo WHERE todo_id=$1 RETURNING *",
      [id]
    );
    res.json(todo.rows);
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.write("<h1>Hello world!</h1>");
  res.end();
});

process.on("SIGINT", () => {
  pool.end().then(() => {
    console.log("PostgreSQL connection pool closed");
    process.exit(0);
  });
});

//APP LISTENER//
app.listen(5000, () => {
  console.log(`Server is running at http://localhost:5000`);
});
