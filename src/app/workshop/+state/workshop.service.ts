import { Injectable, Inject } from '@angular/core';
import { WorkshopStore } from './workshop.store';
import { Workshop } from './workshop.model';
import { WorkshopQuery } from './workshop.query';
import { REMIX, RemixClient } from 'src/app/remix-client';
import { AccountQuery } from 'src/app/account/+state';
import { RemixWorkshopContract } from 'src/app/contracts/contract';

@Injectable({ providedIn: 'root' })
export class WorkshopService {

  constructor(
    @Inject(REMIX) private remix: RemixClient,
    private contract: RemixWorkshopContract,
    private accountQuery: AccountQuery,
    private store: WorkshopStore,
    private query: WorkshopQuery,
  ) {}

  async getAll() {
    await this.remix.onload();
    const isLoggedIn = await this.remix.box.getUserAddress();
    if (isLoggedIn) {
      const tutors = await this.contract.getTutors();
      const requests = tutors.map(tutor => this.remix.box.getSpacePublicData(tutor, undefined));
      const spaces = await Promise.all(requests);
      const workshopsByTutor = spaces.map(space => JSON.parse(space.workshops || '[]'));
      const workshops = [].concat.apply([], workshopsByTutor);
      this.store.upsertMany(workshops);
    }
  }

  async get(id: string) {
    this.store.setActive(id);
    return true;  // to change with 3box
  }

  async getOwned() {
    const fromBox = await this.remix.box.getSpacePublicValue('workshops');
    const workshops = JSON.parse(fromBox || '[]');
    this.store.upsertMany(workshops);
  }

  update(workshop: Workshop) {
    if (this.accountQuery.isLoggedIn) {
      this.store.update(workshop.id, workshop);
      const toBox = JSON.stringify(this.query.owned);
      this.remix.box.setSpacePublicValue('workshops', toBox);
    }
  }

  create(workshops: Workshop | Workshop[]) {
    if (this.accountQuery.isLoggedIn) {
      Array.isArray(workshops)
        ? this.store.upsertMany(workshops)
        : this.store.add(workshops);
      const toBox = JSON.stringify(this.query.owned);
      this.remix.box.setSpacePublicValue('workshops', toBox);
    }
  }

  remove(ids: string | string[]) {
    if (this.accountQuery.isLoggedIn) {
      this.store.remove(ids);
      const toBox = JSON.stringify(this.query.owned);
      this.remix.box.setSpacePublicValue('workshops', toBox);
    }
  }
}
