import { Component, OnInit } from '@angular/core';
import { getSelectors } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rxjs-in-angular-course';

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(getSelectors().selectUrl).subscribe(console.log);
  }
}
