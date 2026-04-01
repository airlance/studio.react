interface LineProps {
    h?: number;
}

export function Line({ h = 36 }: LineProps) {
    const cx = 8;
    const arrowW = 5;
    const arrowH = 7;
    const shaftEnd = h - arrowH - 2;

    return (
        <svg
            width={cx * 2}
            height={h}
            viewBox={`0 0 ${cx * 2} ${h}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 self-center overflow-visible"
            style={{ display: "block" }}
            aria-hidden="true"
        >
            {/* shaft */}
            <line
                x1={cx}
                y1={0}
                x2={cx}
                y2={shaftEnd}
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* open chevron ˅ */}
            <polyline
                points={`${cx - arrowW},${shaftEnd} ${cx},${shaftEnd + arrowH} ${cx + arrowW},${shaftEnd}`}
                stroke="#9ca3af"
                strokeWidth="1.75"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}