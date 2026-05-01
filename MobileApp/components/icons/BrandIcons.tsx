// Custom SVG icons untuk brand yang tidak tersedia di react-icons.
// Tokopedia: react-icons belum punya, bikin sendiri pakai path simpleicons (CC0).

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const TokopediaIcon = ({ size = 20, className, color = "currentColor" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    aria-hidden="true"
  >
    <path d="M5.45 0A3.45 3.45 0 0 0 3 1.01L0 4v16l3 3a3.45 3.45 0 0 0 2.45 1.01h13.1A3.45 3.45 0 0 0 21 22.99l3-3V4l-3-2.99A3.45 3.45 0 0 0 18.55 0H5.45zm6.55 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
  </svg>
);
