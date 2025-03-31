import { Fetch, get_pds_record, get_did_count, get_at_uri } from '../fetch';
import { Identity, Actor, Handle, aka, pds, resolve_did } from './identity';
import { NiceNSID } from './nice-nsid';
import { RenderContent } from './record';
import { nice_time_ago, omit } from '../utils';


export function LonelyStrongRef({ lonelyKey, lonelyVal, nsParts, did, timeUs }) {
  return (
    <div className="border-s-2 ml-[-2px] px-3 pb-0 my-8 mb-16 border-slate-800 bg-slate-900/50">
      <div className="pl-[2px] relative right-8 bottom-5 inline-block">
        <Actor nsParts={nsParts} did={did} timeUs={timeUs}>
          <span className="inline-block ml-2 text-xs">
            <Fetch
              using={get_did_count}
              param={lonelyVal.uri}
              param2={nsParts.join('.')}
              param3={`.${lonelyKey}.uri`}
              ok={({ total }) => (
                <>
                  <span className="text-slate-600"> + </span>
                  <span className="text-cyan-700">{total.toLocaleString()} other{total !== 1 && 's'}</span>
                </>
              )}
            />
          </span>
        </Actor>
      </div>

      <div className="text-xs relative bottom-3">
        <Fetch
          using={get_at_uri}
          param={lonelyVal.uri}
          ok={({ did, collection, record }) => (
            <Referenced did={did} collection={collection} record={record} />
          )}
        />
      </div>
    </div>
  );
}


function Referenced({ record, collection, did }) {
  const without_common_meta = omit(record, ['$type', 'createdAt']);
  const ns_parts = collection.split('.');

  return (
    <div className="ml-2">
      <div className="text-xs align-baseline relative z-1">
        <div className="inline-block">
          <Actor did={did} nsParts={ns_parts} mini={true} />
        </div>
      </div>
      <div className="text-xs left-2 p-3 mr-7 border-s-2 border-slate-700 relative bottom-3 z-0 bg-black">
        <RenderContent cleanRecord={without_common_meta} smol={true} />
      </div>
    </div>
  );
}
