import { UTCTimestamp } from "lightweight-charts";

export default interface Timeseries {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}
