/**
 * MergeConnector
 *
 * Draws N cubic Bézier curves that originate at the bottom-center of each
 * source column and converge into a single exit point at the bottom-center
 * of the total container width.
 *
 * Used for multi-trigger merging into a single flow.
 */

interface MergeConnectorProps {
    /** total pixel width spanning all trigger columns */
    totalWidth: number;
    /** absolute x-center of each trigger card (from left of totalWidth) */
    centers: number[];
    height?: number;
    color?: string;
}

export function MergeConnector({
                                   totalWidth,
                                   centers,
                                   height = 52,
                                   color = "#9ca3af",
                               }: MergeConnectorProps) {
    if (centers.length === 0) return null;

    if (centers.length === 1) {
        // single trigger — just a straight line with chevron
        const cx = totalWidth / 2;
        const arrowH = 7;
        const arrowW = 5;
        const shaftEnd = height - arrowH - 2;
        return (
            <svg
                width={totalWidth}
                height={height}
                viewBox={`0 0 ${totalWidth} ${height}`}
                fill="none"
                style={{ display: "block" }}
                aria-hidden="true"
            >
                <line x1={cx} y1={0} x2={cx} y2={shaftEnd} stroke={color} strokeWidth="2" strokeLinecap="round" />
                <polyline
                    points={`${cx - arrowW},${shaftEnd} ${cx},${shaftEnd + arrowH} ${cx + arrowW},${shaftEnd}`}
                    stroke={color} strokeWidth="1.75" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        );
    }

    const exitX = totalWidth / 2;
    const exitY = height;
    const arrowH = 7;
    const arrowW = 5;
    const curveEnd = height - arrowH - 2;

    return (
        <svg
            width={totalWidth}
            height={height}
            viewBox={`0 0 ${totalWidth} ${height}`}
            fill="none"
            overflow="visible"
            style={{ display: "block" }}
            aria-hidden="true"
        >
            {centers.map((srcX, i) => {
                // cubic bezier: start at srcX,0 → end at exitX,curveEnd
                // cp1 stays near entry (same X), cp2 stays near exit
                const d = `M ${srcX} 0 C ${srcX} ${height * 0.5}, ${exitX} ${height * 0.5}, ${exitX} ${curveEnd}`;
                return (
                    <path
                        key={i}
                        d={d}
                        stroke={color}
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        fill="none"
                    />
                );
            })}

            {/* single chevron arrow at the merge point */}
            <polyline
                points={`${exitX - arrowW},${curveEnd} ${exitX},${exitY - 2} ${exitX + arrowW},${curveEnd}`}
                stroke={color}
                strokeWidth="1.75"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}