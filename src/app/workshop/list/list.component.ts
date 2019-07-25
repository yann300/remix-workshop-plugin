import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop, WorkshopQuery } from '../+state';
import { AccountQuery } from 'src/app/account/+state';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'workshop-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopListComponent implements OnInit {

  faEdit = faEdit;
  faEye = faEye;
  workshops$: Observable<Workshop[]>;

  constructor(private query: WorkshopQuery, private accountQuery: AccountQuery) { }

  ngOnInit() {
    this.workshops$ = this.query.selectAll();
  }

  isOwner(workshop: Workshop) {
    return workshop.author === this.accountQuery.getValue().address;
  }

}
