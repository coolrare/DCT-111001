import { createReducer, on } from '@ngrx/store';
import { Pagination } from '../pagination';
import { TodoItem } from '../todo-item';
import * as TodoListActions from './todo-list.actions';

export const todoListFeatureKey = 'todoList';

export interface State {
  loading: boolean;
  todoList: Pagination<TodoItem>;
}

export const initialState: State = {
  loading: false,
  todoList: {
    totalCount: 0,
    data: [],
  },
};

export const reducer = createReducer(
  initialState,

  on(TodoListActions.loadTodoLists, (state) => state),
  on(TodoListActions.loadTodoListsSuccess, (state, action) => state),
  on(TodoListActions.loadTodoListsFailure, (state, action) => state),

  on(TodoListActions.setTodoList, (state, action) => {
    return {
      ...state,
      todoList: { ...action.todoList },
    };
  }),

  on(TodoListActions.loadingTodoList, (state) => ({
    ...state,
    loading: true
  })),
  on(TodoListActions.unloadingTodoList, (state) => ({
    ...state,
    loading: false
  })),
);
