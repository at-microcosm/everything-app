import { Fetch } from '../fetch';
import { pds, resolve_did } from './identity';

export function Blob({ did, blob, expanded }) {
  const { mimeType, ref: { $link } } = blob;
  const safer_link = encodeURIComponent($link);
  if (mimeType.startsWith('image/')) {
    const url = `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${safer_link}@jpeg`;
    return (
      <a href={url} target="_blank">
        <img src={url} className={expanded ? 'max-h-64 max-w-64' : 'max-h-32 max-w-32'} alt="" />
      </a>
    );
  // } else if (mimeType === 'video/mp4') {
  //   const url = `https://video.cdn.bsky.app/hls/${did}/${safer_link}/playlist.m3u8`;
  //   return (
  //     <a
  //       className="rounded bg-slate-950 border border-slate-700 text-sky-400 px-1 bold cursor-pointer ms-1"
  //       href={url}
  //       target="_blank"
  //     >
  //       🎥 video
  //     </a>
  //   )
  } else {
    return (
      <Fetch
        using={resolve_did}
        param={did}
        ok={doc => {
          const endpoint = pds(doc);
          const url = new URL(`${endpoint}/xrpc/com.atproto.sync.getBlob`);
          url.searchParams.set('did', did);
          url.searchParams.set('cid', $link); // NOT safer_link, don't double-encode
          return (
            <a
              className="rounded bg-slate-950 border border-slate-700 text-sky-400 px-1 bold cursor-pointer ms-1"
              href={url}
              target="_blank"
            >
              🫧 blob
            </a>
          );
        }}
      />
    );
  }
}
