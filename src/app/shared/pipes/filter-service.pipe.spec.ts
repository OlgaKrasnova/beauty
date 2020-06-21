import { FilterService } from './filter-service.pipe';

describe('FilterFirstNamePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterService();
    expect(pipe).toBeTruthy();
  });
});