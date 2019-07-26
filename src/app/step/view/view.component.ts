import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Step, StepQuery, StepService, StepStore } from '../+state';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { UnitTestError } from '@remixproject/plugin';

@Component({
  selector: 'step-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepViewComponent implements OnInit {

  faArrowUp = faArrowUp;
  step$: Observable<Step>;
  success$: Observable<boolean>;
  errors$: Observable<UnitTestError[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private service: StepService,
    private store: StepStore,
    private query: StepQuery,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.step$ = this.query.selectActive().pipe(
      tap(_ => this.store.update({ success: false, error: null })),
      tap(step => this.service.displaySolidity(step))
    );
    this.success$ = this.query.select('success');
    this.errors$ = this.query.selectError<UnitTestError[]>();
    this.isLoading$ = this.query.selectLoading();
  }

  test(step: Step) {
    this.service.testStep(step);
  }

  next() {
    const current = this.query.getActiveId();
    const isLast = this.query.getCount() === current + 1;
    const path = isLast ? ['../../view'] : ['..', current + 1];
    this.router.navigate(path, { relativeTo: this.route });
  }

}