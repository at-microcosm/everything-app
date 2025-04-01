export function BadMd({ content }: { content: String }) {
  const paras = content
    .replace(/\n\s*\n/g, '\n')
    .split('\n');

  if (paras.length === 0) return null;

  if (paras.length === 1) return paras[0];

  return (
    <div>
      {paras.map((p, i) => (
        <p key={i} className="mb-2">{p}</p>
      ))}
    </div>
  );
}
