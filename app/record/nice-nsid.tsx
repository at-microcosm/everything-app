
export function NiceNSID({ parts }) {
  const tld = parts.length > 2 ? parts[0] : null;
  const thinger = parts.length > 2 ? parts[1] : parts[0];
  const btweeners = parts.length > 3
    ? parts.slice(2, parts.length - 1).join('.')
    : null;
  const thing = parts[parts.length - 1];

  return (
    <>
      {tld && <span className="text-slate-600">{tld}.</span>}
      <span className="text-slate-200">{ thinger }</span>
      <span className="text-slate-600">
        .{btweeners && `${btweeners}.`}
      </span>
      <span className="text-yellow-200 bold">{ thing }</span>
    </>
  );
}
