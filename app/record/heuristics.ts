import { isAtprotoDid } from '@atcute/identity';
import { fromString as cidFromString } from '@atcute/cid';
import { omit } from '../utils';

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

export function extract_texts(record: any): { texts: String[], without: any } {
  const texts = [];
  let without = record;
  if (!record) return { texts, without: record };

  // awful strategy: find a top-level key called 'text'
  if (typeof record?.text === 'string') {
    texts.push(record.text);
    without = omit(without, ['text']);
  }

  return { texts, without };
}
