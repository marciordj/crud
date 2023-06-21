import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

function clearDb() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const readTodos = read();

  readTodos.forEach((currentTodo) => {
    const findTodoItem = currentTodo.id === id;

    if (findTodoItem) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        readTodos,
      },
      null,
      2
    )
  );

  if (!updatedTodo) {
    throw new Error("Please, provide a valid ID");
  }

  return updatedTodo;
}

function deleteById(id: UUID) {
  const readTodos = read();

  const todosWithoutOne = readTodos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }

    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
}

// clearDb();
// create("Teste conteudo 1");
// const secondTodo = create("Teste conteudo 2");
// deleteById(secondTodo.id);
