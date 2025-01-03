import { isLogicalOperator } from "../utils/string-utils";

export class DivideBlocksService {
	private conditions: Array<any>;
	private mappedConditions: Array<Record<string, any>>;

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
		console.log(this.conditions, "THIS MAPPED FUCKING CONDITIONS")

		// Sort conditions based on there placement in the strategy

		const sortedConditions = this.conditions.sort((a, b) => a.position - b.position);

		sortedConditions.forEach((condition: { id: number; settings: Array<any> }) => {
			const { id, settings } = condition;
			console.log(id, settings, "FIRST PRINT")
			if ("singleOperator" in settings && isLogicalOperator(settings.singleOperator)) {
				console.log("SignleOperator")
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


