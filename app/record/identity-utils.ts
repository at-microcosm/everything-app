import { CompositeDidDocumentResolver, PlcDidDocumentResolver, WebDidDocumentResolver } from '@atcute/identity-resolver';

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
