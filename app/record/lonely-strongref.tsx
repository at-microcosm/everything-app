import { Identity } from './identity';
import { NiceNSID } from './nice-nsid';

export function LonelyStrongRef({ lonelyKey, lonelyVal, nsParts, did, timeUs }) {

  return (
    <div className="rounded border border-gray-200 px-3 pb-3 my-8 dark:border-gray-700">
      <p>
        <NiceNSID parts={nsParts} />
        <span class="text-slate-500"> ← </span>
        <Identity did={did} />
      </p>
      <p>hi im a lonely strongref { lonelyVal.uri }</p>
    </div>
  );
}
