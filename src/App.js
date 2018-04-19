import React, { Fragment } from "react";
import component from "omniscient";

import {
  loadTodo,
  setAllTodosDone,
  setTodoText,
  structure,
  toggleTodoDone
} from "./structure";

loadTodo(1);
loadTodo(2);
loadTodo(3);

const Author = ({ cursor }) => (
  <div>{cursor.get("loading") ? "Loading..." : cursor.get("name")}</div>
);

const x = [0, 0, 0, 0];

const Todo = component(({ todo, userCursor }) => {
  return (
    <div
      style={{
        margin: "1em",
        backgroundColor: todo.get("done") ? "coral" : "lightgrey"
      }}
    >
      {todo.get("loading") ? (
        "loading..."
      ) : (
        <Fragment>
          <div onClick={() => toggleTodoDone(todo)}>
            {todo.get("done") ? "done" : "not done"}
          </div>
          {x[todo.get("id")]++}
          <input
            onChange={e => setTodoText(todo)(e.target.value)}
            value={todo.get("text")}
          />
          <Author cursor={userCursor} />
        </Fragment>
      )}
    </div>
  );
});

const Todos = component(({ state }) => {
  const usersCursor = state.cursor("users");

  return (
    <div style={{ backgroundColor: "red", padding: "1em" }}>
      {state
        .get("todos")
        .toList()
        .map(todo => (
          <Todo
            key={todo.get("id")}
            todo={todo}
            userCursor={usersCursor.cursor(todo.get("authorId"))}
          />
        ))}
      <div
        onClick={() => setAllTodosDone(state.cursor("todos"))}
        style={{ backgroundColor: "green" }}
      >
        ALL DONE
      </div>
    </div>
  );
});

class App extends React.Component {
  constructor(props) {
    super(props);
    structure.on("swap", () => this.forceUpdate());
  }

  render() {
    return <Todos state={structure.cursor()} />;
  }
}

export default App;
