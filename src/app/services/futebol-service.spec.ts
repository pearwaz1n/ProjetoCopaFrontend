import { TestBed } from '@angular/core/testing';

import { FutebolService } from './futebol-service';

describe('FutebolService', () => {
  let service: FutebolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutebolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
