import { Identity, Actor } from './identity';
import { LonelyStrongRef } from './lonely-strongref';
import { LonelyDID } from './lonely-did';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago, omit } from '../utils';
import { is_strongref, is_did, extract_texts } from './heuristics';


export function UFOsRecord({ record }) {
  const ns_parts = record.collection.split('.');

  const without_common_meta = omit(record.record, ['$type', 'createdAt', 'addedAt']);
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

  if (wcm_keys.length === 0) {
    return (
      <div className="border-s-2 ml-[-2px] px-3 h-4 pb-0 my-8 mb-16 border-slate-800 bg-slate-900/50">
        <div className="pl-[2px] relative right-8 bottom-5 inline-block">
          <Actor nsParts={ns_parts} did={record.did} timeUs={record.time_us}>
            <span className="inline-block ml-4 italic text-slate-500">
              (empty record)
            </span>
          </Actor>
        </div>
      </div>
    );
  }

  return (
    <div className="border-s-2 ml-[-2px] px-3 pb-0 my-8 mb-16 border-slate-800 bg-slate-900/50">
      <div className="pl-[2px] relative right-8 bottom-5 inline-block">
        <Actor nsParts={ns_parts} did={record.did} timeUs={record.time_us} />
      </div>

      <div className="text-xs relative bottom-3">
        <RenderContent cleanRecord={without_common_meta} />
      </div>
    </div>
  );
}

export function RenderContent({ cleanRecord, smol }) {
  const { texts, without } = extract_texts(cleanRecord);
  const without_langs = omit(without, ['langs']);

  if (smol) {
    return (
      <div className="max-h-12 overflow-scroll">
        {texts.map((t, i) => (
          <p key={i} className="my-4">
            {t}
          </p>
        ))}
        <div>
          {Object.keys(without_langs).map(k => (
            <div key={k} className="flex gap-2">
              <p className="text-pink-300">
                {k}:
              </p>
              <pre className="bg-slate-900">
                {JSON.stringify(without_langs[k], null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            <pre className="bg-slate-900">
              {JSON.stringify(without_langs[k], null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </>
  );
}
