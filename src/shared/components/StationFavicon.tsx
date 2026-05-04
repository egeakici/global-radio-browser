import { useState } from 'react';
import { Radio } from 'lucide-react';

interface Props {
  src?: string;
  name: string;
  size?: number;
}

export function StationFavicon({ src, name, size = 40 }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-surface-card text-accent flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Radio size={size * 0.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="rounded-lg object-cover flex-shrink-0"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
