interface GradientDiffusionScannerProps {
  width?: number
  height?: number
  duration?: number
  primaryColor?: string
  scanColor?: string
}

export function GradientDiffusionScanner({
  width = 120,
  height = 80,
  duration = 2,
  primaryColor = "#4CAF50",
  scanColor = "#2196F3",
}: GradientDiffusionScannerProps) {
  const padding = 10
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="diffusionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={scanColor} stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0.4;0" dur={`${duration}s`} repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor={scanColor} stopOpacity="0">
            <animate
              attributeName="stop-opacity"
              values="0;1;0.6;0"
              dur={`${duration}s`}
              begin="0.2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={scanColor} stopOpacity="0">
            <animate
              attributeName="stop-opacity"
              values="0;0.6;0.3;0"
              dur={`${duration}s`}
              begin="0.4s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      <rect
        x={padding}
        y={padding}
        width={innerWidth}
        height={innerHeight}
        rx="6"
        ry="6"
        stroke={primaryColor}
        strokeWidth="2"
        fill="none"
      />

      <rect
        x={padding}
        y={padding}
        width={innerWidth}
        height={innerHeight}
        fill="url(#diffusionGradient)"
        filter="url(#blur)"
        rx="6"
        ry="6"
      />

      {/* Scanning line */}
      <rect x={padding} y={padding} width={innerWidth} height="3" fill={scanColor} rx="1.5">
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`0,0; 0,${innerHeight - 3}; 0,0`}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  )
}
