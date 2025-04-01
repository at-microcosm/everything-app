import { CompositeDidDocumentResolver, PlcDidDocumentResolver, WebDidDocumentResolver } from '@atcute/identity-resolver';
import { Fetch, get_pds_record } from '../fetch';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago } from '../utils';

const docResolver = new CompositeDidDocumentResolver({
  methods: {
    plc: new PlcDidDocumentResolver(),
    web: new WebDidDocumentResolver(),
  },
});

export async function resolve_did(did) {
  return await docResolver.resolve(did);
}

export function aka({ alsoKnownAs, id }) {
  if (!alsoKnownAs) return id;

  let at_handle = alsoKnownAs[0];
  if (!at_handle) return id;
  if (!at_handle.startsWith('at://')) return id;

  at_handle = at_handle.slice('at://'.length);
  if (!at_handle) return id;

  return at_handle;
}

export function pds({ service }) {
  if (!service) {
    throw new Error('missing service from identity doc');
  }
  const { serviceEndpoint } = service[0];
  if (!serviceEndpoint) {
    throw new Error('missing serviceEndpoint from identity service array');
  }
  return serviceEndpoint;
}

export function Identity({ did }) {
  return (
    <>
      <Fetch
        using={resolve_did}
        param={did}
        loading={_ => (
          <span>resolving handle&hellip;</span>
        )}
        error={e => (
          <span>invlaid handle? {`${e}`}</span>
        )}
        ok={doc => <Handle handle={aka(doc)} />}
      />
    </>
  );
}

export function Handle({ handle, hideAt }) {
  const parts = handle.split('.');
  const sub = parts[0];
  const suf = parts.slice(1).join('.');

  return (
    <>
      {!hideAt && <span className="text-slate-600">@</span>}
      <span className="text-cyan-300">{sub}</span>
      <span className="text-slate-400">.{suf}</span>
    </>
  );
}

export function Actor({ did, nsParts, timeUs, children, mini, tiny, hideId }) {
  return (
    <div className="flex gap-1 items-center">
      <Fetch
        using={resolve_did}
        param={did}
        loading={_ => (
          <span>resolving handle&hellip;</span>
        )}
        error={e => (
          <span>invlaid handle? {`${e}`}</span>
        )}
        ok={doc => (
          <>
            <div className="">
              <Fetch
                using={get_pds_record}
                param={pds(doc)}
                param2={did}
                param3={'app.bsky.actor.profile'}
                param4="self"
                ok={({ value }) => !!value?.avatar?.ref?.$link
                  ? <Pfp did={did} link={value.avatar.ref?.$link} mini={mini} tiny={tiny} />
                  : <NoPfp />
                }
              />
            </div>
            <div className="text-xs">
              {tiny ? (
                <p><Handle handle={aka(doc)} hideAt={true} /></p>
              ) : (
                <>
                  <p>
                    {!hideId && <Handle handle={aka(doc)} hideAt={true} />}
                    {mini ? (
                      <>
                        {!hideId && <span className="text-slate-400">'s </span>}
                        <NiceNSID parts={nsParts} collapse={true} />
                        {' '}
                        { children }
                      </>
                    ) : (
                      <span className="text-slate-600">
                        {!hideId && ', '}{ nice_time_ago(timeUs) } ago
                      </span>
                    )}
                  </p>
                  {!mini && <p>
                    <NiceNSID parts={nsParts} />
                    { children }
                  </p>}
                </>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
}

export function Pfp({ did, link, mini, tiny }) {
  const CDN = 'https://cdn.bsky.app/img/avatar/plain'; // freeload for now
  return (
    <img
      alt="user avatar"
      src={`${CDN}/${did}/${link}`}
      className={`block rounded-full ${tiny ? 'w-4 h-4' : mini ? 'w-5 h-5' : 'w-9 h-9'}`}
    />
  );
}

export function NoPfp() {
  return 'no pfp';
}
