export default function FileIcon({ ext, size = 16, className = "" }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    className: `shrink-0 ${className}`,
    "aria-hidden": true,
  };

  switch (ext) {
    case "ts":
      return (
        <svg {...props}>
          <text
            x="8"
            y="12"
            textAnchor="middle"
            fill="#42B4D6"
            fontSize="8"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            TS
          </text>
        </svg>
      );
    case "tsx":
      return (
        <svg {...props}>
          <rect x="7.25" y="7.25" width="1.5" height="1.5" fill="#42B4D6" />
          <ellipse cx="8" cy="8" rx="5.5" ry="2" fill="none" stroke="#42B4D6" strokeWidth="0.75" />
          <ellipse
            cx="8"
            cy="8"
            rx="5.5"
            ry="2"
            fill="none"
            stroke="#42B4D6"
            strokeWidth="0.75"
            transform="rotate(60 8 8)"
          />
          <ellipse
            cx="8"
            cy="8"
            rx="5.5"
            ry="2"
            fill="none"
            stroke="#42B4D6"
            strokeWidth="0.75"
            transform="rotate(120 8 8)"
          />
        </svg>
      );
    case "json":
      return (
        <svg {...props}>
          <text
            x="8"
            y="12"
            textAnchor="middle"
            fill="#CBCB41"
            fontSize="11"
            fontWeight="600"
            fontFamily="Consolas, monospace"
          >
            {"{}"}
          </text>
        </svg>
      );
    case "md":
      return (
        <svg {...props}>
          <path d="M8 2.5 L12 8 H9.5 V13 H6.5 V8 H4 Z" fill="#42B4D6" />
        </svg>
      );
    case "sh":
      return (
        <svg {...props}>
          <text
            x="8"
            y="12"
            textAnchor="middle"
            fill="#89D185"
            fontSize="10"
            fontWeight="700"
            fontFamily="Consolas, monospace"
          >
            $
          </text>
        </svg>
      );
    case "css":
      return (
        <svg {...props}>
          <text
            x="8"
            y="13"
            textAnchor="middle"
            fill="#42A5F5"
            fontSize="13"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            #
          </text>
        </svg>
      );
    default:
      return null;
  }
}
