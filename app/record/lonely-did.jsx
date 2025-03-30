import { Fetch } from '../fetch/fetch';
import { Identity, Handle, aka, resolve_did } from './identity';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago } from '../utils';


export function LonelyDID({ lonelyDid, nsParts, did, timeUs  }) {
  return (
    <div className="pb-3 my-8 mb-11 dark:border-gray-700">
      <p className="bottom-3">
        <Identity did={did} />
        <span className="text-slate-500">: </span>
      </p>
      <p className="text-right">
        <NiceNSID parts={nsParts} />
        <span className="text-slate-500"> → </span>
        <Fetch
          using={resolve_did}
          param={lonelyDid}
          ok={doc => (
            <Handle handle={aka(doc)} />
          )}
        />
      </p>
      <p className="text-xs text-slate-500 italic text-right pr-3">
        { nice_time_ago(timeUs) } ago
      </p>
    </div>
  );
}

