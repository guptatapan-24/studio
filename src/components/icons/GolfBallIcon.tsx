import type { SVGProps } from 'react';

export function GolfBallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a5.5 5.5 0 0 0-3.3 9.7" />
      <path d="M12 22a5.5 5.5 0 0 1-3.3-9.7" />
      <path d="m2 12 4.3 2.5" />
      <path d="m22 12-4.3 2.5" />
      <path d="m7.7 14.5 4.3 2.5" />
      <path d="m16.3 14.5-4.3 2.5" />
      <path d="m7.7 9.5 4.3-2.5" />
      <path d="m16.3 9.5-4.3-2.5" />
    </svg>
  );
}
