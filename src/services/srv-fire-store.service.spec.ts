import { TestBed } from '@angular/core/testing';

import { SrvFireStoreService } from './srv-fire-store.service';

describe('SrvFireStoreService', () => {
  let service: SrvFireStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvFireStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
