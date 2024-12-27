
import { isLogicalOperator } from "../utils/string-utils";
//INPUT
//[
//	[
//		{
//			"indicator": "RSI_14"
//		},
//		{
//			"operator": "<"
//		},
//		{
//			"value": "30"
//		}
//	],
//	[
//		{
//			"singleOperator": "&"
//		}
//	],
//	[
//		{
//			"indicator": "SMA_10"
//		},
//		{
//			"operator": ">"
//		},
//		{
//			"value": "2"
//		}
//	]
//]
//
//OUTPUT
//[
//	[
//		"RSI_14", "<",  "30",
//	],
//	"&",
//	[
//		"SMA_10", ">","2",
//	]
//]



export class BacktestService {
	private conditions: Array<any>;
	private mappedConditions: Array<any>; // Store the final mapped structure.

	constructor(conditions: Array<any>) {
		this.conditions = conditions;
		this.mappedConditions = [];
	}

	private processBlock(block: Array<any>): Array<string | number> {
		const result: Array<string | number> = [];
		block.forEach((item) => {
			if (item.indicator) {
				result.push(item.indicator);
			} else if (item.operator) {
				result.push(item.operator);
			} else if (item.value) {
				result.push(item.value);
			}
		});
		return result;
	}

	processConditions(): Array<any> {
		this.conditions.forEach((block) => {
			if (block.length === 1 && block[0].singleOperator && isLogicalOperator(block[0].singleOperator)) {
				// Add the logical operator directly.
				this.mappedConditions.push(block[0].singleOperator);
			} else {
				// Process condition blocks.
				const processedBlock = this.processBlock(block);
				this.mappedConditions.push(processedBlock);
			}
		});
		return this.mappedConditions;
	}
}

// Example Usage:

// INPUT:

// OUTPUT:
// [
//     ["RSI_14", "<", "30"],
//     "&",
//     ["SMA_10", ">", "2"]
// ]
