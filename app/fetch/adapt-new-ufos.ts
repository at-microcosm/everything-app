export function adapt_new_ufos(bleh) {
  console.log('aw');
  // this will lose inner leaves. oh well for now.
  const by_nsid = {};
  const f = (path, o) => {
    let child_segments = Object.keys(o.nsid_child_segments);
    if (child_segments.length === 0) {
      by_nsid[path.join('.')] = o.total_records;
    } else {
      child_segments.forEach(segment =>
        f([...path, segment], o.nsid_child_segments[segment]));
    }
  };
  f([], bleh);
  return by_nsid;
}
