import { useOverflow } from './overflow';

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
