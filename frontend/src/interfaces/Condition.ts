
export interface Condition {
    indicator: string | null;
    operator: string;
    value: number | string | { indicator: string };
}


export type ConditionGroup = Condition[];


export type LogicalOperator = "&" | "|" | "~";


export type ConditionsArray = Array<ConditionGroup | LogicalOperator>;

