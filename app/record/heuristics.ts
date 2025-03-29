import { isAtprotoDid } from '@atcute/identity';
import { fromString as cidFromString } from '@atcute/cid';

export function is_strongref(obj: any): boolean {
  if (!obj) return false;
  if (typeof obj !== 'object') return false;
  if (Object.keys(obj).length !== 2) return false;
  if (typeof obj.cid !== 'string') return false;
  if (typeof obj.uri !== 'string') return false;
  try {
    const _ = cidFromString(obj.cid);
  } catch (_) {
    return false;
  }
  if (!obj.uri.startsWith("at://")) return false;
  return true;
}

export function is_did(obj: any): boolean {
  return isAtprotoDid(obj);
}
