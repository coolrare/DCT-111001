import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodoList from './todo-list.reducer';

export const selectTodoListState = createFeatureSelector<fromTodoList.State>(
  fromTodoList.todoListFeatureKey
);

export const selectTodoList = createSelector(
  selectTodoListState,
  (state) => state.todoList
);

export const selectTodoListLoading = createSelector(
  selectTodoListState,
  (state) => state.loading
);
