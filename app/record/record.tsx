import { Identity } from './identity';
import { LonelyStrongRef } from './lonely-strongref';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago, omit } from '../utils';
import { is_strongref, is_did } from './heuristics';

export function Record({ record }) {
  const ns_parts = record.collection.split('.');

  const without_common_meta = omit(record.record, ['$type', 'createdAt']);
  const wcm_keys = Object.keys(without_common_meta);

  if (wcm_keys.length === 1) {
    let lonely_key = wcm_keys[0];
    let lonely_val = without_common_meta[lonely_key];
    if (is_strongref(lonely_val)) {
      return (
        <LonelyStrongRef
          lonelyKey={lonely_key}
          lonelyVal={lonely_val}
          nsParts={ns_parts}
          did={record.did}
          timeUs={record.time_us}
        />
      );
    } else if (is_did(lonely_val)) {
      return <p>oh neat i'm just a did <NiceNSID parts={ns_parts} /></p>;
    }
  }

  return (
    <div className="rounded border border-gray-200 px-3 pb-3 my-8 dark:border-gray-700">
      <div className="relative bottom-3 inline-block px-1 bg-gray-950">
        <NiceNSID parts={ns_parts} />
        <span class="text-slate-500"> ← </span>
        <Identity did={record.did} />
      </div>

      <pre className="text-xs max-h-24 overflow-scroll">
        {JSON.stringify(without_common_meta, null, 2)}
      </pre>

      <p className="text-xs float-right text-slate-500 italic inline-block relative top-1 bg-gray-950 px-1">
        { nice_time_ago(record.time_us) } ago
      </p>
    </div>
  );
}
