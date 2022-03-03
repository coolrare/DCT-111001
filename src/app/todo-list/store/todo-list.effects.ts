import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, EMPTY, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { TodoListService } from '../todo-list.service';
import * as TodoListActions from './todo-list.actions';

@Injectable()
export class TodoListEffects {
  loadTodoLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoListActions.loadTodoLists),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map((data) => TodoListActions.loadTodoListsSuccess({ data })),
          catchError((error) =>
            of(TodoListActions.loadTodoListsFailure({ error }))
          )
        )
      )
    );
  });

  queryTodoList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoListActions.queryTodoList),
      concatMap((condition) =>
        // 組合成一條 action stream
        concat(
          // loading action
          of(TodoListActions.loadingTodoList()),
          // 更新資料 action
          this.todoListService
            .getTodoList(
              condition.keyword,
              condition.pagination,
              condition.sort
            )
            .pipe(
              map((result) => TodoListActions.setTodoList({ todoList: result }))
            ),
          // unloading action
          of(TodoListActions.unloadingTodoList())
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private todoListService: TodoListService
  ) {}
}
