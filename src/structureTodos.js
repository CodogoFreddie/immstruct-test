import immstruct from "immstruct";
import { Map } from "immutable";

const getTodoData = id => {
  fetch(`https://www.example.com/get-todo/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      done: id === 2,
      text: `this is the text for todo ${id}`
    });
  });
};

export const structureTodos = immstruct("todos", []);

export const loadTodo = id => {
  structureTodos.cursor().update(todos =>
    todos.push(
      Map()
        .set("id", id)
        .set("loading", true)
    )
  );

  const i = structureTodos.cursor().size - 1;

  getTodoData(id).then(({ done, text }) =>
    structureTodos.cursor(i).update(todo =>
      todo
        .set("loading", false)
        .set("done", done)
        .set("text", text)
    )
  );
};

export const toggleTodoDone = state =>
  state.cursor("done").update(done => !done);

export const setTodoText = state => value =>
  state.cursor("text").update(() => value);
