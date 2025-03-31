import { resolve_did, pds } from '../record/identity';
import { get_pds_record } from '.';
import { parse_at_uri } from '../utils';

export async function get_at_uri(atUri: String): {
  did: String,
  collection?: String,
  rkey?: String,
  pds: String,
  record: String,
} {
  const { did, collection, rkey } = parse_at_uri(atUri);
  const doc = await resolve_did(did);
  const endpoint = pds(doc);
  const { value } = await get_pds_record(endpoint, did, collection, rkey);
  return {
    did,
    collection,
    rkey,
    pds: endpoint,
    record: value,
  };
}
