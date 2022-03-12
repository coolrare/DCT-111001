import { Pagination } from './../pagination';
import { Action, createReducer, on } from '@ngrx/store';
import * as TodoListActions from './todo-list.actions';
import { TodoItem } from '../todo-item';

export const todoListFeatureKey = 'todoList';

export interface State {
  todoList: Pagination<TodoItem>,
}

export const initialState: State = {
  todoList: {
    data: [],
    totalCount: 0
  }
};

// switch
export const reducer = createReducer(
  initialState,

  on(TodoListActions.loadTodoLists, state => state),
  on(TodoListActions.loadTodoListsSuccess, (state, action) => state),
  on(TodoListActions.loadTodoListsFailure, (state, action) => state),

  // case
  on(TodoListActions.initTodoList, state => ({
    ...state,
    todoList: {
      data: [
        { id: '1', text: 'Todo 1', done: true, created: new Date().getTime() },
        { id: '2', text: 'Todo 2', done: true, created: new Date().getTime() }
      ],
      totalCount: 0
    }
  }))

);
