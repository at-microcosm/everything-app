import { getJson } from './get-json';

const endpoint = (collection, limit = 3) =>
  `http://localhost:9999/records?collection=${collection}&limit=${limit}`; // todo: avoid query injection

export async function getCollectionRecords(collections, onProgress = () => {}) {
  const total = collections.length;
  let goods = 0;
  let fails = 0;

  let results = collections.map(getCollectionRecords)

  onProgress({ goods, fails, total });

  async function getCollectionRecords(collection) {
    const req = getJson(endpoint(collection));

    req
      .then(_ => goods += 1, _ => fails += 1)
      .then(_ => onProgress({ goods, fails, total }));

    return await req;
  }

  const nested = await Promise.all(results);
  return nested.flat(1);
}
