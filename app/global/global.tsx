import { Timeline } from '../timeline/timeline';
import { Fetch } from '../fetch/fetch';
import { getAllCollectionRecords } from '../fetch';


export function Global() {
  const collections_url = "http://localhost:9999/collections";

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>UFOs in the ATmosphere</h1>
        </header>
        <div className="max-w-[560px] w-full space-y-6 px-4">
          <Fetch
            using={getAllCollectionRecords}
            loading={() => <p>loading&hellip;</p>}
            ok={records => <Timeline records={records} />}
          />
        </div>
      </div>
    </main>
  );
}
