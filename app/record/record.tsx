import { Identity } from './identity';
import { nice_time_ago } from '../utils';

export function Record({ record }) {
  return (
    <div className="rounded border border-gray-200 px-3 pb-1 dark:border-gray-700">
      <Identity did={record.did} />
      <p>sup rec: {record.collection}</p>
      <p className="text-xs text-right text-slate-500 italic">{ nice_time_ago(record.time_us) } ago</p>
    </div>
  );
}
