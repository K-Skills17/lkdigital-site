'use client';

// Renders a lead magnet's server-built markup and runs its page script once on the client.
// `mount(root, props)` attaches the page behaviour; it must be safe to call once per root.
import { useEffect, useRef } from 'react';

export default function Island({ html, mount, props }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || root.dataset.mounted) return undefined;
    root.dataset.mounted = '1';
    const cleanup = mount(root, props || {});
    return typeof cleanup === 'function' ? cleanup : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
