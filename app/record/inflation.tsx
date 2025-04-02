import { useRef, useState, useLayoutEffect } from 'react';
import useSize from '@react-hook/size';

export const useOverflow = () => {
  const ref = useRef(null);
  const [_, height] = useSize(ref);
  const [overflows, setOverflows] = useState(true);
  const [expanded, setExpanded] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.offsetHeight);
  }, [height]);
  return [ref, overflows, expanded, setExpanded];
}

export function Fill({ overflows, expanded, setExpanded, clsExtra }) {
  if (expanded) {
    return (
      <div
        className={`block text-xs bg-slate-800 text-center text-sky-400 leading-none cursor-pointer ${clsExtra}`}
        onClick={() => setExpanded(false)}
      >
        - collapse
      </div>
    );
  } else if (overflows) {
    return (
      <div
        className={`block text-xs bg-slate-800 text-center text-sky-400 leading-none cursor-pointer ${clsExtra}`}
        onClick={() => setExpanded(true)}
      >
        + expand
      </div>
    );
  }
}
