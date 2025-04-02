import { useState } from 'react';
import { Fetch, get_at_uri } from '../fetch';
import { Identity, Actor } from './identity';
import { LonelyStrongRef } from './lonely-strongref';
import { LonelyDID } from './lonely-did';
import { NiceNSID } from './nice-nsid';
import { BadMd } from './bad-md';
import { Blob } from './blob';
import { nice_time_ago, omit, parse_at_uri, is_object, is_blob } from '../utils';
import { is_aturi, is_strongref, is_did, extract_texts } from './heuristics';
import { useOverflow, Fill } from './inflation';



export function UFOsRecord({ record }) {
  const [scrollRef, overflows, expanded, setExpanded] = useOverflow();

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
          scrollRef={scrollRef}
          overflows={overflows}
          expanded={expanded}
          setExpanded={setExpanded}
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
        <RenderContent cleanRecord={without_common_meta} parentDid={record.did} expanded={expanded} scrollRef={scrollRef} />
      </div>

      <Fill overflows={overflows} expanded={expanded} setExpanded={setExpanded} clsExtra="-mx-3" />
    </div>
  );
}

export function RenderContent({ cleanRecord, parentDid, smol, expanded, scrollRef }) {
  const { texts, without } = extract_texts(cleanRecord);
  const without_langs = omit(without, ['langs']);

  if (smol) {
    return (
      <div className={`${expanded ? '' : 'max-h-12'} overflow-scroll`} ref={scrollRef}>
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
                <RenderValue val={without_langs[k]} parentDid={parentDid} expanded={expanded} />
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
      <div className={`${expanded ? '' : 'max-h-24'} overflow-scroll`} ref={scrollRef}>
        {Object.keys(without_langs).map(k => (
          <div key={k} className="flex gap-2">
            <p className="text-pink-300">
              {k}:
            </p>
            <RenderValue val={without_langs[k]} parentDid={parentDid} expanded={expanded} />
          </div>
        ))}
      </div>
    </>
  );
}

function RenderValue({ val, parentDid, expanded }) {
  if (typeof val === 'string') {
    if (is_did(val)) {
      return (
        <Actor did={val} tiny={true} />
      );
    } else if (is_aturi(val)) {
      return (
        <Fetch
          using={get_at_uri}
          param={val}
          ok={({ did, collection, record }) => (
            <Referenced did={did} collection={collection} record={record} hideId={did === parentDid} expanded={expanded} />
          )}
        />
      );
    }
    return (
      <BadMd content={val} />
    );
  } else if (is_strongref(val)) {
    return (
      <Fetch
        using={get_at_uri}
        param={val.uri}
        ok={({ did, collection, record }) => (
          <Referenced did={did} collection={collection} record={record} hideId={did === parentDid} expanded={expanded} />
        )}
      />
    );
  } else if (typeof val === 'boolean') {
    return val ? '✅' : '❌';
  } else if (typeof val === 'number') {
    return (
      <span className="font-mono text-orange-400">{val}</span>
    );
  } else if (Array.isArray(val)) {
    if (val.length === 0) {
      return <span className="italic text-slate-500">empty</span>;
    } else if (val.length === 1) {
      return <RenderValue val={val[0]} parentDid={parentDid} expanded={expanded} />
    }
    return (
      <ul className="list-disc marker:text-sky-400 ml-3">
        {val.map((v, i) => (
          <li key={i} className="mb-1">
            <RenderValue val={val[i]} parentDid={parentDid} expanded={expanded} />
          </li>
        ))}
      </ul>
    );
  } else if (is_blob(val)) {
    return <Blob did={parentDid} blob={val} expanded={expanded} />;
  } else if (is_object(val)) {
    const keys = Object.keys(val);
    if (keys.length === 0) {
      return <span className="italic text-slate-500">(empty object)</span>
    }
    return (
      <div className="">
        {keys.map(k => (
          <div key={k} className="flex gap-2 mb-1 border-s-1 border-pink-800 border-dotted ps-1">
            <p className="text-pink-400">
              {k}:
            </p>
            <RenderValue val={val[k]} parentDid={parentDid} expanded={expanded} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <pre className="bg-slate-900">
      {JSON.stringify(val, null, 2)}
    </pre>
  );
}

function Referenced({ record, collection, did, hideId, expanded }) {
  const [show, setShow] = useState(false);

  const without_common_meta = omit(record, ['$type', 'createdAt']);
  const ns_parts = collection.split('.');

  return (
    <div className="ml-2">
      <div className="text-xs align-baseline relative z-1">
        <div className="inline-block">
          <Actor did={did} nsParts={ns_parts} mini={true} hideId={hideId}>
            <button
              className="rounded bg-slate-950 border border-slate-700 text-sky-400 px-1 bold cursor-pointer ms-1"
              onClick={() => setShow(!show)}
            >
              {show ? 'hide' : 'show'}
            </button>
          </Actor>
        </div>
      </div>
      {show && (
        <div className="text-xs left-2 p-3 mr-7 border-s-2 border-slate-700 relative bottom-3 z-0 bg-black">
          <RenderContent cleanRecord={without_common_meta} parentDid={did} smol={true} expanded={expanded} />
        </div>
      )}
    </div>
  );
}
