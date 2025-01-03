
export interface Condition {
    indicator: string | null;
    operator: string;
    value: number | string | { indicator: string | null };
}

export interface CreateConditionRequest {
    side: Side;
    settings: Record<string, any> | Array<any>;
}


export type ConditionElement =
    | { operator: string }
    | { value: number }
    | { indicator: string | null, id: number };

export type ConditionGroup = Condition[];

export type ConditionInput = LogicalOperator | ConditionGroup;

export type LogicalOperator = "&" | "|" | "~" | "<" | ">";

export type Side = "buy" | "sell"

export type ConditionsArray = Array<ConditionGroup | LogicalOperator>;

