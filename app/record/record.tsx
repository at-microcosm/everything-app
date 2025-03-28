import { Identity } from './identity';
import { nice_time_ago, omit } from '../utils';

export function Record({ record }) {
  const ns_parts = record.collection.split('.');
  const ns_group = ns_parts.slice(0, ns_parts.length - 2).join('.');
  const ns_thing = ns_parts[ns_parts.length - 1];

  return (
    <div className="rounded border border-gray-200 px-3 pb-3 my-8 dark:border-gray-700">
      <div className="relative bottom-3 inline-block px-1 bg-gray-950">
        <span class="text-slate-500">
          {ns_group}.
        </span>
        <span class="text-yellow-200">
          { ns_thing }
        </span>
        <span class="text-slate-500"> ← </span>
        <Identity did={record.did} />
      </div>

      <pre className="text-xs max-h-24 overflow-scroll">
        {JSON.stringify(omit(record.record, ['$type', 'createdAt']), null, 2)}
      </pre>

      <p className="text-xs float-right text-slate-500 italic inline-block relative top-1 bg-gray-950 px-1">
        { nice_time_ago(record.time_us) } ago
      </p>
    </div>
  );
}
