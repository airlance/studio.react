import { STYLES } from "@/constants/automation";

export function Line({ h = 28 }: { h?: number }) {
    return <div style={{ ...STYLES.line, height: h }} />;
}
