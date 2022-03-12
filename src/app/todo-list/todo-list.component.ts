import { initTodoList } from './store/todo-list.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { PageChangeEvent } from './page-change-event';
import { Pagination } from './pagination';
import { SortChangeEvent } from './sort-change-event';
import { TodoItem } from './todo-item';
import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  // suggestList: string[] = [];
  keyword$ = new BehaviorSubject<string>('');
  suggestList$ = this.keyword$.pipe(
    filter(keyword => keyword.length >= 3),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(keyword => this.todoListService.getSuggestList(keyword))
  );

  // totalCount = 0;
  // todoList: TodoItem[] = [];

  // keyword = '';
  // sort: SortChangeEvent = {
  //   sortColumn: 'created',
  //   sortDirection: 'desc'
  // };
  // pagination: PageChangeEvent = {
  //   pageNumber: 1,
  //   pageSize: 10
  // };
  searchKeyword$ = new BehaviorSubject('');
  refresh$ = new BehaviorSubject(null);
  sort$ = new BehaviorSubject<SortChangeEvent>({
    sortColumn: 'created',
    sortDirection: 'desc'
  });
  pagination$ = new BehaviorSubject<PageChangeEvent>({
    pageNumber: 1,
    pageSize: 10
  });

  todoListQuery$ = combineLatest([this.refresh$, this.searchKeyword$, this.sort$, this.pagination$])
    .pipe(
      debounceTime(0),
      tap(() => this.loading$.next(true)),
      switchMap(([_, keyword, sort, pagination]) => this
        .todoListService
        .getTodoList(keyword, pagination, sort)
        .pipe(
          finalize(() => this.loading$.next(false))
        )
      ),
      startWith(<Pagination<TodoItem>>{ totalCount: 0, data: [] }),
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        alert(error.error.message);
        return of(<Pagination<TodoItem>>{ totalCount: 0, data: [] })
      }),
    );

  todoList$ = this.todoListQuery$.pipe(
    map(result => result.data)
  );
  totalCount$ = this.todoListQuery$.pipe(
    map(result => result.totalCount)
  );

  // loading = false;
  loading$ = new BehaviorSubject(false);

  constructor(
    private todoListService: TodoListService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.refreshTodoList();

    // read
    this.store.subscribe(data => {
      console.log(data);
    });

    // write
    this.store.dispatch(initTodoList());

  }

  setSuggestList(keyword: string) {
    this.keyword$.next(keyword);
    // this.todoListService.getSuggestList(keyword).subscribe((result) => {
    //   this.suggestList = result;
    // });
  }

  refreshTodoList() {
    this.refresh$.next(null);
    // this.loading = true;
    // this.todoListService
    //   .getTodoList(
    //     this.keyword,
    //     this.pagination,
    //     this.sort
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       this.totalCount = result.totalCount;
    //       this.todoList = result.data;
    //       this.loading = false;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       alert(error.error.message);
    //     },
    //   });
  }

  sortChange(event: SortChangeEvent) {
    this.sort$.next({ ...event });
    // this.sort = { ...event };
    // this.refreshTodoList();
  }

  refresh() {
    this.refreshTodoList();
  }

  pageChange(event: PageChangeEvent) {
    this.pagination$.next({
      pageNumber: event.pageNumber + 1,
      pageSize : event.pageSize
    });
    // this.pagination = {
    //   pageNumber: event.pageNumber + 1,
    //   pageSize : event.pageSize
    // };
    // this.refreshTodoList();
  }

  displayTodoDialog() {
    this.dialog
      .open(TodoListAddDialogComponent)
      .afterClosed()
      .subscribe((text) => {
        if (text !== '') {
          this.todoListService.addTodo(text).subscribe((item) => {
            this.refreshTodoList();
          });
        }
      });
  }

  resetSortAndPage() {
    this.sort$.next({
      sortColumn: 'created',
      sortDirection: 'desc'
    });

    this.pagination$.next({
      pageNumber: 1,
      pageSize: 10
    });
    // this.sort = {
    //   sortColumn: 'created',
    //   sortDirection: 'desc'
    // };

    // this.pagination = {
    //   pageNumber: 1,
    //   pageSize: 10
    // };
  }

  search(keyword: string) {
    this.searchKeyword$.next(keyword);
    // this.keyword = keyword;
    this.resetSortAndPage();
    // this.refreshTodoList();
  }

  todoItemStatusChange(status: TodoItemStatusChangeEvent) {
    this.todoListService
      .updateTodoDoneStatus(status.id, status.done)
      .subscribe((item) => {
        this.refreshTodoList();
      });
  }

  todoItemDelete(id: string) {
    this.todoListService.deleteTodoItem(id).subscribe(() => {
      this.refreshTodoList();
    });
  }
}
