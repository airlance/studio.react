/**
 * BranchCurve
 *
 * Draws a single cubic Bézier that originates at the horizontal center of
 * `containerWidth` (where the parent card sits) and lands at the center of
 * the branch column below.
 *
 * Usage: place it as the first child of each branch column div.
 * The column div must have a fixed width (`branchWidth`).
 * `parentOffset` = how many pixels from the left edge of THIS column
 *                  the parent card's center sits.
 *                  For the left branch:  parentOffset = totalWidth/2 - leftEdge
 *                  For the right branch: parentOffset = totalWidth/2 - leftEdge
 *
 * Simpler alternative used here: each BranchCurve receives the *absolute*
 * x-position of the parent center and the absolute x-position of its own
 * center, then draws relative to its own coordinate space.
 */

interface BranchCurveProps {
    /** pixel width of this branch column */
    branchWidth: number;
    /**
     * horizontal offset (px) of the parent card centre
     * relative to the LEFT edge of this branch column.
     * Negative = parent is to the right of this column.
     */
    parentCenterOffset: number;
    height?: number;
    color?: string;
}

export function BranchCurve({
                                branchWidth,
                                parentCenterOffset,
                                height = 52,
                                color = "#9ca3af",
                            }: BranchCurveProps) {
    const exitX = branchWidth / 2;   // where we arrive (branch column centre)
    const entryX = exitX + parentCenterOffset; // where we come from

    const arrowH = 7;
    const arrowW = 5;

    // cubic bezier control points:
    // cp1 stays near entry (same X), cp2 stays near exit (same X)
    // this creates the "waterfall" S-curve
    const cp1x = entryX;
    const cp1y = height * 0.5;
    const cp2x = exitX;
    const cp2y = height * 0.5;

    const curveEnd = height - arrowH - 1;

    const d = `M ${entryX} 0 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${exitX} ${curveEnd}`;

    // Arrow chevron at the bottom pointing downward
    const arrowPath = [
        `M ${exitX - arrowW} ${curveEnd}`,
        `L ${exitX} ${curveEnd + arrowH}`,
        `L ${exitX + arrowW} ${curveEnd}`,
    ].join(" ");

    return (
        <svg
            width={branchWidth}
            height={height}
            viewBox={`0 0 ${branchWidth} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 overflow-visible"
            aria-hidden="true"
            style={{ display: "block" }}
        >
            <path
                d={d}
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d={arrowPath}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}