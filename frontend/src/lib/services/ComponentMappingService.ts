//NEW INPUT [
//  {
//    "id": 28,
//    "settings": [
//      {
//        "indicator": "SMA_10"
//      },
//      {
//        "operator": ">"
//      },
//      {
//        "indicator": "SMA_10"
//      }
//    ]
//  },
//  {
//    "id": 29,
//    "settings": [
//      {
//        "indicator": "SMA_10"
//      },
//      {
//        "operator": ">"
//      },
//      {
//        "indicator": "SMA_10"
//      }
//    ]
//  }
//]

// [[{indicator:"SMA_10"},{operator:">"},{value:1}],"&",[{indicator:"RSI_14"},{operator:">"},{value:1}]]

//export default class ConditionExtractionService {
//	conditions: Array<any>;
//
//	constructor(conditions: Array<any>) {
//		this.conditions = conditions;
//	}
//
//	processConditions() {
//		this.conditions.forEach((condition: Array<any> | string) => {
//			if (typeof condition === "string") {
//				this.extract("singleOperator", condition);
//				this.blockEnd(id)
//			} else if (Array.isArray(condition)) {
//				condition.forEach((inner) => {
//					if (typeof inner === "object" && inner !== null) {
//						if ("value" in inner) {
//							//console.log("Inner object represents a value:", inner);
//							this.extract("value", inner['value']);
//						} else if ("indicator" in inner) {
//							//console.log("Inner object represents an indicator:", inner);
//							this.extract("indicator", inner['indicator']);
//						} else if ("operator" in inner) {
//							//console.log("Inner object represents an operator:", inner);
//							this.extract("operator", inner['operator']);
//						} else {
//							console.log("Inner object is unknown:", inner);
//						}
//					} else {
//						console.log("Inner value is of a wrong type:", inner);
//					}
//				});
//				this.blockEnd()
//			} else {
//				console.log("Value is neither a string nor an array:", condition);
//			}
//		});
//	}
//	blockEnd(number): void {
//	}
//	extract(kind: string, value: string, id: number): void {
//		console.log(kind, value);
//		throw new Error("Method 'extract()' must be implemented in the subclass.");
//	}
//
//	getConditions(): Array<any> {
//		throw new Error("Method 'getConditions()' must be implemented in the subclass.");
//	}
//}
//

// Input
// [[{indicator:"SMA_10"},{operator:">"},{value:1}],"&",[{indicator:"RSI_14"},{operator:">"},{value:1}]]
// Output
//[["indicator","SMA_10"],["operator",">"],["value",1],"blockEnd",["singleOperator","&"],"blockEnd",
//  ["indicator","RSI_14"],["operator",">"],["value",1],"blockEnd"]
import { isLogicalOperator } from "../utils/string-utils";



export class DivideBlocksService {
	private conditions: Array<any>;
	private mappedConditions: Array<[string, string] | Record<string, number>>;

	constructor(conditions: Array<any>) {
		this.conditions = conditions;
		this.mappedConditions = [];
	}



	blockEnd(id: number): void {
		this.mappedConditions.push({ "conditionId": id });
	}

	extract(kind: string, value: string, id: number): void {
		this.mappedConditions.push([kind, value, id]);
	}

	processConditions() {
		this.conditions.forEach((condition: { id: number; settings: Array<any> }) => {
			const { id, settings } = condition;
			if ("singleOperator" in settings && isLogicalOperator(settings.singleOperator)) {
				this.extract("singleOperator", settings.singleOperator, id);
				this.blockEnd(id)
			} else {

				settings.forEach((inner) => {
					if (typeof inner === "object" && inner !== null) {
						if ("value" in inner) {
							this.extract("value", inner["value"], id);
						}
						else if ("indicator" in inner) {
							this.extract("indicator", inner["indicator"], id);
						}
						else if ("operator" in inner) {
							this.extract("operator", inner["operator"], id);
						} else {
							console.log("Inner object is unknown:", inner);
						}
					} else {
						console.log("Inner value is of a wrong type:", inner);
					}
				});
				this.blockEnd(id);
			}
		});
	}

	getConditions(): Array<[string, string] | Record<string, number>> {
		return this.mappedConditions;
	}
}
