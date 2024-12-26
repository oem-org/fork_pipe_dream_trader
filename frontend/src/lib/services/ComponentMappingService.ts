
export default class ConmponentMappingService {
	conditions: Array<any>;

	constructor(conditions: Array<any>) {
		this.conditions = conditions;
	}

	processConditions() {
		this.conditions.forEach((condition: Record<any, any>) => {
			this.extract(condition)
			this.blockEnd()
		});
	}
	blockEnd(): void {
	}
	extract(value: Record<any, any>): void {
		console.log(value);
		throw new Error("Method 'extract()' must be implemented in the subclass.");
	}

	getConditions(): Array<any> {
		throw new Error("Method 'getConditions()' must be implemented in the subclass.");
	}
}


// Input
// [[{indicator:"SMA_10"},{operator:">"},{value:1}],"&",[{indicator:"RSI_14"},{operator:">"},{value:1}]]
// Output
//[["indicator","SMA_10"],["operator",">"],["value",1],"blockEnd",["singleOperator","&"],"blockEnd",
//  ["indicator","RSI_14"],["operator",">"],["value",1],"blockEnd"]

export class DivideBlocksService extends ConmponentMappingService {
	private mappedConditions: Array<Record<any, any> | string>;

	constructor(conditions: Array<any>) {
		super(conditions);
		this.mappedConditions = [];
	}

	blockEnd(): void {
		this.mappedConditions.push("blockEnd")
	}

	extract(value: Record<any, any>): void {
		this.mappedConditions.push(value);
	}

	getConditions(): Array<Record<any, any> | string> {
		return this.mappedConditions;
	}
}
