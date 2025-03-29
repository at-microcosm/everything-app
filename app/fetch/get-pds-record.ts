import { XRPC, CredentialManager } from '@atcute/client';

export async function get_pds_record(endpoint, did, collection, rkey) {
  const manager = new CredentialManager({ service: endpoint });
  const rpc = new XRPC({ handler: manager });
  const res = await rpc.get('com.atproto.repo.getRecord', {
    params: { repo: did, collection, rkey },
  });
  return res.data;
}
