import React from 'react';

interface CashAppVerifiedBadgeProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Official Cash App verification badge:
 * 16-point scalloped starburst in Cash App verification blue (#3399FF) with white checkmark
 */
export const CashAppVerifiedBadge: React.FC<CashAppVerifiedBadgeProps> = ({
  className = 'w-4 h-4',
  size,
  title = 'Verified Account',
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none inline-block ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <path
        d="M36.24 4.291a5 5 0 0 1 7.52 0l4.885 5.575a5 5 0 0 0 4.539 1.644l7.22-1.137a5 5 0 0 1 5.778 4.861l.114 7.349a5 5 0 0 0 2.415 4.203l6.374 3.847a5 5 0 0 1 1.302 7.428l-4.612 5.693a5 5 0 0 0-.842 4.775l2.4 6.969a5 5 0 0 1-3.763 6.533l-7.288 1.435a5 5 0 0 0-3.703 3.116l-2.606 6.8a5 5 0 0 1-7.104 2.578l-6.434-3.587a5 5 0 0 0-4.87 0l-6.434 3.587a5 5 0 0 1-7.104-2.577l-2.606-6.8a5 5 0 0 0-3.703-3.117L10.43 62.03a5 5 0 0 1-3.762-6.533l2.399-6.97a5 5 0 0 0-.842-4.774L3.613 38.06a5 5 0 0 1 1.302-7.428l6.374-3.847a5 5 0 0 0 2.415-4.203l.114-7.349a5 5 0 0 1 5.778-4.861l7.22 1.137a5 5 0 0 0 4.539-1.644l4.884-5.575z"
        fill="#3399FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.84 31.41a3.75 3.75 0 0 1 0 5.304L37.963 53.59a3.75 3.75 0 0 1-5.303 0l-7.5-7.5a3.75 3.75 0 0 1 5.303-5.303l4.849 4.848 14.223-14.223a3.75 3.75 0 0 1 5.303 0z"
        fill="#FFFFFF"
      />
    </svg>
  );
};
