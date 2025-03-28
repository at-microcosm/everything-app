import { useState } from 'react';
import { Timeline } from '../timeline/timeline';
import { Fetch } from '../fetch/fetch';
import { getJson } from '../fetch/get-json';
import { getCollectionRecords } from '../fetch/get-collection-records';


export function Global() {
  const collections_url = "http://localhost:9999/collections";

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>UFOs: everything app</h1>
        </header>
        <div className="max-w-[640px] w-full space-y-6 px-4">
          <Fetch
            using={getJson}
            param={collections_url}
            loading={_ => <p>Loading collections&hellip;</p>}
            ok={json => (
              <>
                <CollectionsLoader collections={json} />
                <pre>{JSON.stringify(json, null, 2)}</pre>
              </>
            )}
          />
        </div>
      </div>
    </main>
  );
}

function CollectionsLoader({ collections }) {
  const [progress, setProgress] = useState({ goods: 0, fails: 0, total: 0 });

  const names = Object.keys(collections);
  return (
    <Fetch
      using={() => getCollectionRecords(names, setProgress)}
      param={names.join(',')/* hack */}
      loading={() => progress.total > 0
        ? (
          <p>loading {progress.goods} / {progress.total} ({progress.fails} fails)</p>
        )
        : (
          <p>loading but maybe hit a bug? total is {progress.total}, should be &gt; 0</p>
        )}
      ok={records => <Timeline records={records} />}
    />
  );
}
