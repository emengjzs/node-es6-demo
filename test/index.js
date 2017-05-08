import test from './../lib/model/script/mock-history-data';

describe('csv read', () => {
  const t = new test();
  it('success', async () => {
    const data = await t.getBusCountIndexModel();
    console.log(data.getIndexData(0, 86400 / 60));
  })
});