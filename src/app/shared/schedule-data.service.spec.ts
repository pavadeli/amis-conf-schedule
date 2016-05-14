import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ScheduleDataService } from './schedule-data.service';

describe('ScheduleData Service', () => {
  beforeEachProviders(() => [ScheduleDataService]);

  it('should ...',
      inject([ScheduleDataService], (service: ScheduleDataService) => {
    expect(service).toBeTruthy();
  }));
});
