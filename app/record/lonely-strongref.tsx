import { Fetch } from '../fetch/fetch';
import { get_pds_record } from '../fetch/get-pds-record';
import { Identity, Handle, aka, pds, resolve_did } from './identity';
import { NiceNSID } from './nice-nsid';
import { omit, parse_at_uri } from '../utils';


export function LonelyStrongRef({ lonelyKey, lonelyVal, nsParts, did, timeUs }) {
  let uri;
  try {
    uri = parse_at_uri(lonelyVal.uri);
  } catch (e) {
    return <p>error: oops {`${e}`}</p>;
  }

  return (
    <div className="rounded border border-gray-200 px-3 pb-3 my-8 dark:border-gray-700">
      <p>
        <NiceNSID parts={nsParts} />
        <span className="text-slate-500"> ← </span>
        <Identity did={did} />
      </p>
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
  );
}

function Referenced({ record, collection, poster }) {
  const without_common_meta = omit(record, ['$type', 'createdAt']);
  const ns_parts = collection.split('.');

  return (
    <div>
      <p>
        <NiceNSID parts={ns_parts} />
        <span className="text-slate-500"> ← </span>
        <Handle handle={poster} />
      </p>
      <pre className="text-xs max-h-24 overflow-scroll">
        {JSON.stringify(without_common_meta, null, 2)}
      </pre>
    </div>
  );
}
