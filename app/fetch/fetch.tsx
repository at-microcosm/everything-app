import { useEffect, useState } from 'react';

const loadingDefault = () => (
  <p><em>Loading&hellip;</em></p>
);

const errorDefault = err => (
  <p className="error mono">
    <strong>Error</strong>:<br/>{`${err}`}
  </p>
);

export function Fetch({ using, param, ok, loading, error }) {
  const [asyncData, setAsyncData] = useState({ state: null });

  useEffect(() => {
    let ignore = false;
    setAsyncData({ state: 'loading' });
    (async () => {
      try {
        const data = await using(param);
        !ignore && setAsyncData({ state: 'done', data });
      } catch (err) {
        !ignore && setAsyncData({ state: 'error', err });
      }
    })();
    return () => { ignore = true; }
  }, [param]);


  if (asyncData.state === 'loading') {
    return (loading || loadingDefault)(param);
  } else if (asyncData.state === 'error') {
    return (error || errorDefault)(asyncData.err);
  } else if (asyncData.state === null) {
    return <p>wat, request has not started (bug?)</p>;
  } else {
    if (asyncData.state !== 'done') { console.warn(`unexpected async data state: ${asyncData.state}`); }
    return ok(asyncData.data);
  }
}
