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
  const extractedCondition = conditionService.extract();

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
