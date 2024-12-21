import { Condition } from "@/interfaces/Condition";

export default class ConditionExtractionService {
  conditions: (Condition[] | string)[];

  constructor(conditions: (Condition[] | string)[]) {
    this.conditions = conditions;
  }

  processConditions() {
    this.conditions.forEach((condition) => {
      if (typeof condition === "string") {
        console.log("Value is a string:", condition);
        this.extract("singleOperator", condition);
      } else if (Array.isArray(condition)) {
        condition.forEach((inner) => {
          if (typeof inner === "object" && inner !== null) {
            if ("value" in inner) {
              console.log("Inner object represents a value:", inner);
              this.extract("value", inner.value);
            } else if ("indicator" in inner) {
              console.log("Inner object represents an indicator:", inner);
              this.extract("indicator", inner);
            } else if ("operator" in inner) {
import React from "react";
import BuildConditionInputsService from "@/lib/services/BuildConditionInputsService";
import SingleOperator from "./SingleOperator";

import Indicator from "./Indicator";
import Operator from "./Operator";
import Value from "./Value";

import InputSmall from "../ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";

interface BuildConditionRendererProps {
  conditions: Array<any>
}

function BuildConditionRenderer({ conditions }: BuildConditionRendererProps) {
  const conditionService = new BuildConditionInputsService(conditions);

  // Use the `extract` method to determine the type
  const extractedConditions = conditionService.getConditions();

  // Render the appropriate component
  switch (kind) {
    case "singleOperator":
      return <SingleOperator condition={extractedCondition as string} />;
    case "indicator":
      return <IndicatorConditionSelect condition={extractedCondition} />;
    case "operator":
      return <Operator condition={extractedCondition} />;
    case "value":
      return <InputSmall name="Value" />;
    default:
      return <div>Unknown condition type</div>;
  }
};

export default BuildConditionRenderer;
              console.log("Inner object represents an operator:", inner);
              this.extract("operator", inner);
            } else {
              console.log("Inner object is unknown:", inner);
            }
          } else {
            console.log("Inner value is of a wrong type:", inner);
          }
        });
      } else {
        console.log("Value is neither a string nor an array:", condition);
      }
    });
  }

  // Abstract extract method (must be implemented in subclasses or overridden in the class itself)
  extract(kind: string, value: string) {
    console.log(kind, value)
    throw new Error("Method 'extract()' must be implemented in the subclass.");
  }
  getConditions(): Array<any> {
    throw new Error("Method 'extract()' must be implemented in the subclass.");
  }
}

