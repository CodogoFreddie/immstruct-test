import immstruct from "immstruct";
import { Map } from "immutable";

const getTodoData = id => {
  fetch(`https://www.example.com/get-todo/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      done: id === 2,
      text: `this is the text for todo ${id}`,
      authorId: id % 2 ? "aaa" : "bbb"
    });
  });
};

const getUserData = id => {
  fetch(`https://www.example.com/get-user/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      name: id === "aaa" ? "Freddie" : "Marcello"
    });
  });
};

export const structure = immstruct({
  todos: {},
  users: {}
});

export const loadUser = id => {
  if (!structure.cursor("users").get(id)) {
    structure.cursor("users").update(users =>
      users.set(
        id,
        Map()
          .set("id", id)
          .set("loading", true)
      )
    );

    getUserData(id).then(({ name }) =>
      structure
        .cursor(["users", id])
        .update(user => user.set("loading", false).set("name", name))
    );
  }
};

export const loadTodo = id => {
  structure.cursor("todos").update(todos =>
    todos.set(
      id,
      Map()
        .set("id", id)
        .set("loading", true)
    )
  );

  getTodoData(id).then(({ done, text, authorId }) => {
    structure.cursor(["todos", id]).update(todo =>
      todo
        .set("loading", false)
        .set("done", done)
        .set("text", text)
        .set("authorId", authorId)
    );

    return loadUser(authorId);
  });
};

export const toggleTodoDone = state =>
  state.cursor("done").update(done => !done);

export const setTodoText = state => value =>
  state.cursor("text").update(() => value);

export const setAllTodosDone = state =>
  state.update(todos => todos.map(todo => todo.set("done", true)));

setTimeout(() => {
  const first = structure.cursor();

  console.log(first.deref() === first.deref());
}, 3000);
