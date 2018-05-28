import { BacgroundCubesThreejsPage } from './app.po';

describe('bacground-cubes-threejs App', () => {
  let page: BacgroundCubesThreejsPage;

  beforeEach(() => {
    page = new BacgroundCubesThreejsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
