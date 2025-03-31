import { UFOsRecord } from '../record/record';

export function Timeline({ records }) {
  const sorted = records.toSorted((a, b) => b.time_us - a.time_us);

  const rootTotals = {};
  const collectionTotals = {};

  let lastAdded;
  let lastLastAdded;

  const filtered = sorted.filter(({ collection }, i, els) => {
    if (collection === lastAdded || collection === lastLastAdded) {
      return false;
    }
    if (!collectionTotals[collection]) {
      collectionTotals[collection] = 0;
    }
    collectionTotals[collection] += 1;
    if (collectionTotals[collectionTotals] > 3) {
      return false;
    }
    const root = collection.split('.').slice(0, 2).join('.');
    if (!rootTotals[root]) {
      let base = 0;
      if (root === 'app.bsky') {
        base = 5;
      } else if (root === 'chat.bsky') {
        base = 6;
      } else if (root === 'blue.flashes') {
        base = 4;
      }
      rootTotals[root] = base;
    }
    rootTotals[root] += 1;
    if (rootTotals[root] > 8) {
      return false;
    }
    lastLastAdded = lastAdded;
    lastAdded = collection;
    return true;
  });

  return (
    <div className="border-s-2 border-dotted border-gray-800">
      {filtered.map(r => (
        <UFOsRecord
          key={`${r.did}/${r.collection}/${r.rkey}#${r.time_us}`}
          record={r}
        />
      ))}
    </div>
  );

}
