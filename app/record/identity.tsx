import { CompositeDidDocumentResolver, PlcDidDocumentResolver, WebDidDocumentResolver } from '@atcute/identity-resolver';
import { Fetch } from '../fetch/fetch';

const docResolver = new CompositeDidDocumentResolver({
  methods: {
    plc: new PlcDidDocumentResolver(),
    web: new WebDidDocumentResolver(),
  },
});

const resolveHandle = async did => {
  const { alsoKnownAs } = await docResolver.resolve(did);
  if (!alsoKnownAs) return did;

  let at_handle = alsoKnownAs[0];
  if (!at_handle) return did;
  if (!at_handle.startsWith('at://')) return did;

  at_handle = at_handle.slice('at://'.length);
  if (!at_handle) return did;

  return at_handle;
}

export function Identity({ did }) {
  return (
    <>
      <Fetch
        using={resolveHandle}
        param={did}
        loading={_ => (
          <span>resolving handle&hellip;</span>
        )}
        ok={handle => <Handle handle={handle} />}
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
      <span class="text-slate-600">@</span>
      <span class="text-cyan-300">{sub}</span>
      <span class="text-slate-600">.{suf}</span>
    </>
  );
}
