import { Fetch } from '../fetch/fetch';
import { get_pds_record } from '../fetch';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago } from '../utils';
import { aka, resolve_did, pds } from './identity-utils';

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
      <span className="text-cyan-300 break-all">{sub}</span>
      <span className="text-slate-400 break-all">.{suf}</span>
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
                error={e => <NoPfp err={true} mini={mini} tiny={tiny} />}
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

export function NoPfp({ err, mini, tiny }) {
  return (
    <div
      className={`block text-xs flex items-center justify-center ${err ? 'text-orange-300' : 'text-slate-500'} bg-slate-800 rounded-full ${tiny ? 'w-4 h-4' : mini ? 'w-5 h-5' : 'w-9 h-9'}`}
      title="failed to load user profile pic"
    >
      <span>:)</span>
    </div>
  );
}
