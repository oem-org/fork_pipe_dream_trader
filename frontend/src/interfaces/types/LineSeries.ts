import { LineData } from "lightweight-charts";


export interface LineSeries {
    name: string;
    lineColor: string,
    data: LineData[],
}
