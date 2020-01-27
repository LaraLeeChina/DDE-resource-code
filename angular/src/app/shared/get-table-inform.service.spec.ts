import { TestBed } from '@angular/core/testing';

import { GetTableInformService } from './get-table-inform.service';

describe('GetTableInformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetTableInformService = TestBed.get(GetTableInformService);
    expect(service).toBeTruthy();
  });
});
