import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
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
        this.todoListService.getTodoList(
          condition.keyword,
          condition.pagination,
          condition.sort
        )
      ),
      map(result => TodoListActions.setTodoList({ todoList: result}))
    );
  });

  constructor(
    private actions$: Actions,
    private todoListService: TodoListService
  ) {}
}
