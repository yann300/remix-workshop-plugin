import { Component, Input, Inject } from '@angular/core';
import { WorkshopStep } from 'src/app/workshop/+state';
import { REMIX } from 'src/app/remix-client';
import { PluginClient } from '@remixproject/plugin';

@Component({
  selector: 'step-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class StepListComponent {

  stepIndex = 0;
  started = false;  // Create a state

  @Input() steps: WorkshopStep[];

  constructor(@Inject(REMIX) private remix: PluginClient) { }

  // async start(step: WorkshopStep) {
  //   const filename = `browser/${step.id}.sol`;
  //   await this.remix.call('fileManager', 'setFile', filename, step.solidity);
  //   await this.remix.call('fileManager', 'switchFile', filename);
  //   this.started = true;
  // }

  next(max: number) {
    if (this.stepIndex === max - 1) {
      return;
    }
    this.stepIndex++;
    this.started = false;
  }
}
