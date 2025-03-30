import { Identity } from './identity';
import { LonelyStrongRef } from './lonely-strongref';
import { LonelyDID } from './lonely-did';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago, omit } from '../utils';
import { is_strongref, is_did, extract_texts } from './heuristics';

function Action({ nsParts, did }) {
  return (
    <>
      <NiceNSID parts={nsParts} />
      <span className="text-slate-500"> ← </span>
      <Identity did={did} />
    </>
  );
}

export function UFOsRecord({ record }) {
  const ns_parts = record.collection.split('.');

  const without_common_meta = omit(record.record, ['$type', 'createdAt']);
  const wcm_keys = Object.keys(without_common_meta);

  if (wcm_keys.length === 0) {
    return (
      <div className="pr-3 my-10 mb-16">
        <Action nsParts={ns_parts} did={record.did} />
        <p className="text-xs text-right text-slate-500 italic bg-gray-950 px-1 baseline">
          { nice_time_ago(record.time_us) } ago
        </p>
      </div>
    );
  } else if (wcm_keys.length === 1) {
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
      return (
        <LonelyDID
          lonelyDid={lonely_val}
          nsParts={ns_parts}
          did={record.did}
          timeUs={record.time_us}
        />
      );
    }
  }

  return (
    <div className="rounded border border-gray-200 px-3 pb-3 my-8 mb-10 dark:border-gray-700">
      <div className="relative bottom-3 inline-block px-1 bg-gray-950">
        <Action nsParts={ns_parts} did={record.did} />
      </div>

      <div className="text-xs">
        <RenderContent cleanRecord={without_common_meta} />
      </div>

      <p className="text-xs float-right text-slate-500 italic inline-block relative top-1 bg-gray-950 px-1">
        { nice_time_ago(record.time_us) } ago
      </p>
    </div>
  );
}

export function RenderContent({ cleanRecord }) {
  const { texts, without } = extract_texts(cleanRecord);
  const without_langs = omit(without, ['langs']);

  return (
    <>
      {texts.map((t, i) => (
        <p key={i} className="my-4">
          {t}
        </p>
      ))}
      <div className="max-h-24 overflow-scroll">
        {Object.keys(without_langs).map(k => (
          <div key={k} className="flex gap-2">
            <p className="text-pink-300">
              {k}:
            </p>
            <pre>
              {JSON.stringify(without_langs[k], null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </>
  );
}
