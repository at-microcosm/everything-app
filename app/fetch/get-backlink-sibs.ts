import { getJson } from './get-json';

const HOST = 'https://constellation.microcosm.blue';

export async function get_did_count(target, collection, path) {
  const url = new URL(`${HOST}/links/count/distinct-dids`);
  url.searchParams.set('target', target);
  url.searchParams.set('collection', collection);
  url.searchParams.set('path', path);
  return await getJson(url);
}
