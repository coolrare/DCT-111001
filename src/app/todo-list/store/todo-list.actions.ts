import { createAction, props } from '@ngrx/store';
import { PageChangeEvent } from '../page-change-event';
import { Pagination } from '../pagination';
import { SortChangeEvent } from '../sort-change-event';
import { TodoItem } from '../todo-item';

export const loadTodoLists = createAction(
  '[TodoList] Load TodoLists'
);

export const loadTodoListsSuccess = createAction(
  '[TodoList] Load TodoLists Success',
  props<{ data: any }>()
);

export const loadTodoListsFailure = createAction(
  '[TodoList] Load TodoLists Failure',
  props<{ error: any }>()
);

export const setTodoList = createAction(
  '[TodoList] Load default TodoList',
  props<{ todoList: Pagination<TodoItem>}>()
);

export const queryTodoList = createAction(
  '[TodoList] Query TodoList',
  props<{
    keyword: string,
    sort: SortChangeEvent,
    pagination: PageChangeEvent
  }>()
);

export const loadingTodoList = createAction(
  '[TodoList] Loading TodoList'
);

export const unloadingTodoList = createAction(
  '[TodoList] Unloading TodoList'
);
