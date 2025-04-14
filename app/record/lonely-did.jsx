import { Fetch } from '../fetch/fetch';
import { Identity, Actor, Handle } from './identity';
import { aka, resolve_did } from './identity-utils';
import { NiceNSID } from './nice-nsid';
import { nice_time_ago } from '../utils';


export function LonelyDID({ lonelyDid, nsParts, did, timeUs  }) {
  return (
    <div className="flex border-s-2 ml-[-2px] pl-3 my-8 mb-16 border-transparent items-center relative right-8 w-[106%]">
      <div className="pl-[2px] inline-block">
        <Actor nsParts={nsParts} did={did} timeUs={timeUs} />
      </div>
      <p className="text-slate-500 mx-5">
        →
      </p>
      <div>
        <Actor did={lonelyDid} nsParts={[]} tiny={true} />
      </div>
    </div>
  );
}

