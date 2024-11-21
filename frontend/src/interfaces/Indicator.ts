export default interface Indicator {
    id?: number | undefined   
    kind: string
    settings: string
    strategy_fk?: number
    chart_style: string
}