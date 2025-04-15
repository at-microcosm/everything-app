import { Link } from 'react-router';
import { Timeline } from '../timeline/timeline';
import { Fetch } from '../fetch/fetch';
import { getOneCollectionRecords } from '../fetch';


export function ByCollection({ collection }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>
            <Link to="/">UFOs in the ATmosphere</Link>
          </h1>
        </header>
        <div className="max-w-[560px] w-full space-y-6 px-4">
          <Fetch
            using={getOneCollectionRecords}
            param={collection}
            loading={() => <p>loading&hellip;</p>}
            ok={records => <Timeline records={records} all={true} />}
          />
        </div>
      </div>
    </main>
  );
}
