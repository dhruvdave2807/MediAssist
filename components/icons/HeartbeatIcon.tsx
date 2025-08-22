
import React from 'react';

export const HeartbeatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l3-3 1.5 1.5 3-3 1.5 1.5 3-3 3 3M3.75 13.5V18m16.5-4.5V18"
    />
  </svg>
);
