import { Component, OnInit } from '@angular/core';
import { AccountQuery, AccountService } from '../+state';
import { Observable } from 'rxjs';

@Component({
  selector: 'account-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private service: AccountService, private query: AccountQuery) { }

  ngOnInit() {
    this.isLoggedIn$ = this.query.isLoggedIn$;
  }

  logout() {
    this.service.logout();
  }
}