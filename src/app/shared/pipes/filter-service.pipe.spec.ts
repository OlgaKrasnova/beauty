import { FilterService } from './filter-service.pipe';

describe('filterService', () => {
  it('create an instance', () => {
    const pipe = new FilterService();
    expect(pipe).toBeTruthy();
  });
});