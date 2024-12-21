import { Condition } from "@/interfaces/Condition";
import ConditionExtractionService from "./ConditionExtractionService";

export default class BuildConditionInputsService extends ConditionExtractionService {
	
	extract(kind: string, value) {
		if (kind === "singleOperator") {
			return condition
		}
		else if (kind === "indicator") {
			return condition
		}
		else if (kind === "operator") {
			return condition
		}
		else if (kind === "value") {

		}
		else {
			console.error("Wrong condition format")
		}

	}

	getConditions(): Array<any> {
		
	}
}
