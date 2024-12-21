//import React from "react";
//
//import Indicator from "./Indicator";
//import Operator from "./Operator";
//import Value from "./Value";
//
//import InputSmall from "../ui/forms/input-small";
//import IndicatorConditionSelect from "./indicator-condition-select";
import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";
import InputSmall from "@/components/ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
interface BuildConditionRendererProps {
  conditions: Array<any>
}

function BuildConditionRenderer({ conditions }: BuildConditionRendererProps) {
  const conditionService = new BuildConditionsService(conditions);
  conditionService.processConditions(); // Ensure conditions are processed
  const mappedConditions = conditionService.getConditions();

  return (
    <div>
      {mappedConditions.map(([kind, value], index) => {
        switch (kind) {
          case "singleOperator":
            return <SingleOperator key={index} value={value} />;
          case "indicator":
            return <IndicatorConditionSelect key={index} initialValue={value} />;
          case "operator":
            return <OperatorConditionSelect key={index}>Operator: {value}</div>;
          case "value":
            return <InputSmall name="Value" />;

          default:
            return <div key={index}>Unknown Condition: {value}</div>;
        }
      })}
    </div>
  );
};

export default BuildConditionRenderer;
