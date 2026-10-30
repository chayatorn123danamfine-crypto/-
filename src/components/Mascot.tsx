import React from 'react';

interface MascotProps {
  mode?: 'wave' | 'peek' | 'sit';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onLeftEyeClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mode = 'sit',
  size = 'md',
  className = '',
  onLeftEyeClick,
}) => {
  const pink = '#f8b4cd';
  const line = '#e58cb0';

  const sizeClasses = {
    sm: 'w-[62px]',
    md: 'w-[92px]',
    lg: 'w-[120px]',
  };

  const isPeek = mode === 'peek';
  const isWave = mode === 'wave';

  return (
    <div
      className={`mascot-wrap select-none flex-none ${sizeClasses[size]} ${className}`}
      data-m={mode}
      aria-hidden="false"
    >
      <svg
        viewBox="0 0 140 160"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="มาสคอตกระต่ายสีชมพู"
        className="w-full h-auto overflow-visible animate-[floaty_4.2s_ease-in-out_infinite]"
      >
        {/* Left ear */}
        <g className="animate-[earL_7s_ease-in-out_infinite]" style={{ transformOrigin: '52px 64px' }}>
          <ellipse
            cx="48"
            cy="34"
            rx="13"
            ry="32"
            fill="#f4a1c0"
            stroke={line}
            strokeWidth="2"
            transform="rotate(-7 48 34)"
          />
          <ellipse
            cx="48"
            cy="38"
            rx="6"
            ry="21"
            fill="#fcd2e1"
            transform="rotate(-7 48 38)"
          />
        </g>

        {/* Right ear */}
        <g className="animate-[earR_7s_1.2s_ease-in-out_infinite]" style={{ transformOrigin: '88px 64px' }}>
          <ellipse
            cx="92"
            cy="34"
            rx="13"
            ry="32"
            fill="#f4a1c0"
            stroke={line}
            strokeWidth="2"
            transform="rotate(7 92 34)"
          />
          <ellipse
            cx="92"
            cy="38"
            rx="6"
            ry="21"
            fill="#fcd2e1"
            transform="rotate(7 92 38)"
          />
        </g>

        {/* Lower body (hidden in peek mode) */}
        {!isPeek && (
          <g className="m-low">
            <ellipse cx="70" cy="138" rx="32" ry="20" fill={pink} stroke={line} strokeWidth="2" />
            <path
              d="M41 134 Q70 116 99 134 L101 152 Q70 160 39 152 Z"
              fill="#fff"
              stroke="#d3dbe0"
              strokeWidth="1.5"
            />
            {/* Medical green cross */}
            <path d="M67 131h6v5h5v6h-5v5h-6v-5h-5v-6h5z" fill="#1e9a54" />
            <ellipse
              cx="38"
              cy="132"
              rx="7"
              ry="11"
              fill={pink}
              stroke={line}
              strokeWidth="2"
              transform="rotate(14 38 132)"
            />
            <g
              className={isWave ? 'animate-[wave_3.8s_1s_ease-in-out_infinite]' : ''}
              style={{ transformOrigin: '100px 122px' }}
            >
              <ellipse
                cx="102"
                cy="130"
                rx="7"
                ry="11"
                fill={pink}
                stroke={line}
                strokeWidth="2"
                transform="rotate(-14 102 130)"
              />
            </g>
          </g>
        )}

        {/* Head */}
        <ellipse cx="70" cy="84" rx="42" ry="36" fill={pink} stroke={line} strokeWidth="2" />

        {/* Cheek blushes (Red dots) */}
        <circle cx="42" cy="93" r="6.2" fill="#e11d2e" opacity="0.92" />
        <circle cx="98" cy="93" r="6.2" fill="#e11d2e" opacity="0.92" />

        {/* Green eyes with pupils & highlights (blinking animation) */}
        <g className="animate-[blink_5.5s_infinite]" style={{ transformOrigin: '70px 80px' }}>
          {/* Eye 1 (viewer left: cx=54) */}
          <g
            onClick={(e) => {
              if (onLeftEyeClick) {
                e.stopPropagation();
                onLeftEyeClick();
              }
            }}
            className={onLeftEyeClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            style={{ pointerEvents: onLeftEyeClick ? 'all' : 'none' }}
          >
            <circle cx="54" cy="80" r="8" fill="#2fa564" />
            <circle cx="54" cy="80" r="4.2" fill="#0f4d2b" />
            <circle cx="51.6" cy="77.4" r="2.2" fill="#fff" />
          </g>

          {/* Eye 2 (viewer right / bunny anatomical left: cx=86) */}
          <g
            onClick={(e) => {
              if (onLeftEyeClick) {
                e.stopPropagation();
                onLeftEyeClick();
              }
            }}
            className={onLeftEyeClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            style={{ pointerEvents: onLeftEyeClick ? 'all' : 'none' }}
          >
            <circle cx="86" cy="80" r="8" fill="#2fa564" />
            <circle cx="86" cy="80" r="4.2" fill="#0f4d2b" />
            <circle cx="83.6" cy="77.4" r="2.2" fill="#fff" />
          </g>
        </g>

        {/* Nose and mouth */}
        <ellipse cx="70" cy="91" rx="3.6" ry="2.7" fill="#e0557f" />
        <path
          d="M70 93.6v2.8M70 96.4c-2 3-6.5 3-8 .4M70 96.4c2 3 6.5 3 8 .4"
          fill="none"
          stroke="#c24570"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Peeking paws (shown only in peek mode) */}
        {isPeek && (
          <g className="m-paws">
            <ellipse cx="50" cy="114" rx="9" ry="7" fill={pink} stroke={line} strokeWidth="2" />
            <ellipse cx="90" cy="114" rx="9" ry="7" fill={pink} stroke={line} strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
