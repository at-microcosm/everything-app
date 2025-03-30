import { CompositeDidDocumentResolver, PlcDidDocumentResolver, WebDidDocumentResolver } from '@atcute/identity-resolver';
import { Fetch } from '../fetch';

const docResolver = new CompositeDidDocumentResolver({
  methods: {
    plc: new PlcDidDocumentResolver(),
    web: new WebDidDocumentResolver(),
  },
});

export const resolve_did = async did => await docResolver.resolve(did);

export const aka = ({ alsoKnownAs, id }) => {
  if (!alsoKnownAs) return id;

  let at_handle = alsoKnownAs[0];
  if (!at_handle) return id;
  if (!at_handle.startsWith('at://')) return id;

  at_handle = at_handle.slice('at://'.length);
  if (!at_handle) return id;

  return at_handle;
}

export const pds = ({ service }) => {
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

export function Handle({ handle }) {
  const parts = handle.split('.');
  const sub = parts[0];
  const suf = parts.slice(1).join('.');

  return (
    <>
      <span className="text-slate-600">@</span>
      <span className="text-cyan-300">{sub}</span>
      <span className="text-slate-600">.{suf}</span>
    </>
  );
}
