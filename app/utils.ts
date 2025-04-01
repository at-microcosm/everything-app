export function nice_time_ago(us: Number): String {
  let dt = +new Date() - (us / 1000);
  if (dt < 1000) {
    return `${Math.round(dt)} ms`;
  }
  dt /= 1000; // seconds
  if (dt < 60) {
    return `${Math.round(dt)} s`;
  }
  dt /= 60; // minutes
  if (dt < 60) {
    return `${Math.round(dt)} min${Math.round(dt) > 1 ? 's' : ''}`;
  }
  dt /= 60; // hours
  if (dt < 48) {
    return `${Math.round(dt)} hr${Math.round(dt) > 1 ? 's' : ''}`;
  }
  dt /= 24; // days
  return `${Math.round(dt)} day${Math.round(dt) > 1 ? 's' : ''}`;
}

export function omit(obj, keys) {
  let out = {};
  Object.keys(obj).filter(k => !keys.includes(k)).forEach(k => out[k] = obj[k]);
  return out;
}

export function parse_at_uri(uri: String): { did: String, collection?: String, rkey?: String } {
  let collection, rkey;
  if (!uri.startsWith('at://')) {
    throw new Error('invalid at-uri: did not start with "at://"');
  }
  let remaining = uri.slice('at://'.length); // remove the at:// prefix
  remaining = remaining.split('#')[0]; // hash is valid in at-uri but we don't handle them
  remaining = remaining.split('?')[0]; // query is valid in at-uri but we don't handle it
  const segments = remaining.split('/');
  if (segments.length === 0) {
    throw new Error('invalid at-uri: could not find did after "at://"');
  }
  const did = segments[0];
  if (segments.length > 1) {
    collection = segments[1];
  }
  if (segments.length > 2) {
    rkey = segments.slice(2).join('/'); // hmm are slashes actually valid in rkey?
  }
  return { did, collection, rkey };
}

export function is_object(o: any): boolean {
  return typeof o === 'object' && !Array.isArray(o) && o !== null;
}
