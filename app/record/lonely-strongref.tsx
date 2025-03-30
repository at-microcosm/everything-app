import { Fetch } from '../fetch/fetch';
import { get_pds_record } from '../fetch/get-pds-record';
import { Identity, Handle, aka, pds, resolve_did } from './identity';
import { NiceNSID } from './nice-nsid';
import { RenderContent } from './record';
import { nice_time_ago, omit, parse_at_uri } from '../utils';


export function LonelyStrongRef({ lonelyKey, lonelyVal, nsParts, did, timeUs }) {
  let uri;
  try {
    uri = parse_at_uri(lonelyVal.uri);
  } catch (e) {
    return <p>error: oops {`${e}`}</p>;
  }

  return (
    <div className="pb-3 my-8 mb-12 dark:border-gray-700">
      <div className="opacity-69">
        <Fetch
          using={resolve_did}
          param={uri.did}
          ok={doc => (
            <Fetch
              using={get_pds_record}
              param={pds(doc)}
              param2={uri.did}
              param3={uri.collection}
              param4={uri.rkey}
              ok={({ value }) => (
                <Referenced record={value} collection={uri.collection} poster={aka(doc)} />
              )}
            />
          )}
        />
      </div>
      <p className="relative float-right right-2 inline-block px-1 bg-gray-950 rounded bottom-3 leading-5 text-right">
        <NiceNSID parts={nsParts} />
        <span className="text-slate-500"> ← </span>
        <Identity did={did} />
        <br/>
        <span className="text-xs text-slate-500 italic">
          { nice_time_ago(timeUs) } ago
        </span>
      </p>
    </div>
  );
}

function Referenced({ record, collection, poster }) {
  const without_common_meta = omit(record, ['$type', 'createdAt']);
  const ns_parts = collection.split('.');

  return (
    <div className="rounded border border-gray-200 p-3 pb-5 dark:border-gray-700 bg-slate-900">
      <p className="text-xs">
        <NiceNSID parts={ns_parts} />
        <span className="text-slate-500"> ← </span>
        <Handle handle={poster} />
      </p>
      <div className="text-xs">
        <RenderContent cleanRecord={without_common_meta} />
      </div>
    </div>
  );
}
