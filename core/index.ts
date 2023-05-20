import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

interface Todo {
  id: string;
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

function read(): Array<Todo> {
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

function update(id: string, partialTodo: Partial<Todo>): Todo {
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

  console.log("update -->", updatedTodo);

  if (!updatedTodo) {
    throw new Error("Please, provide a valid ID");
  }

  return updatedTodo;
}

clearDb();
create("Teste conteudo 1");
create("Teste conteudo 2");
const terceiraTodo = create("Teste conteudo 3");
update(terceiraTodo.id, {
  content: "Atualizada",
  done: true,
});

console.log(read());
