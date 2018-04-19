import React, {Fragment} from 'react';
import component from 'omniscient';

import {
  loadTodo,
  setAllTodosDone,
  setTodoText,
  structureTodos,
  toggleTodoDone,
} from './structureTodos';

loadTodo(1);
loadTodo(2);
loadTodo(3);

const Todo = component(({todo}) => (
  <div
    style={{
      margin: '1em',
      backgroundColor: todo.get('done') ? 'coral' : 'lightgrey',
    }}>
    {todo.get('loading') ? (
      'loading...'
    ) : (
      <Fragment>
        <div onClick={() => toggleTodoDone(todo)}>
          {todo.get('done') ? 'done' : 'not done'}
        </div>
        <input
          onChange={e => setTodoText(todo)(e.target.value)}
          value={todo.get('text')}
        />
      </Fragment>
    )}
  </div>
));

const Todos = component(({cursor}) => (
  <div style={{backgroundColor: 'red', padding: '1em'}}>
    {cursor.map(todo => <Todo key={todo.get('id')} todo={todo} />)}
    <div
      onClick={() => setAllTodosDone(cursor)}
      style={{backgroundColor: 'green'}}>
      ALL DONE
    </div>
  </div>
));

class App extends React.Component {
  constructor(props) {
    super(props);
    structureTodos.on('swap', () => this.forceUpdate());
  }

  render() {
    return <Todos cursor={structureTodos.cursor()} />;
  }
}

export default App;
