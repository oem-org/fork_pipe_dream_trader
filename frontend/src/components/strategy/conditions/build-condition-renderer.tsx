import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";
import InputSmall from "@/components/ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";

interface BuildConditionRendererProps {
  conditions: Array<any>;
}

function BuildConditionRenderer({ conditions }: BuildConditionRendererProps) {
  const conditionService = new BuildConditionsService(conditions);
  conditionService.processConditions(); // Ensure conditions are processed
  const mappedConditions = conditionService.getConditions();

  let currentBlock: JSX.Element[] = [];
  const blocks: JSX.Element[] = [];

  mappedConditions.forEach((condition, index) => {
    if (condition === "blockEnd") {
      blocks.push(
        <div key={`block-${blocks.length}`}>
          {currentBlock}
        </div>
      );
      currentBlock = [];
    } else {
      const [kind, value] = condition as [string, string];
      let component: JSX.Element;

      switch (kind) {
        case "singleOperator":
          component = <SingleOperator key={index} initialValue={value} />;
          break;
        case "indicator":
          component = <IndicatorConditionSelect key={index} initialValue={value} />;
          break;
        case "operator":
          component = <OperatorConditionSelect key={index} initialValue={value} />;
          break;
        case "value":
          component = <InputSmall key={index} name="Value" />;
          break;
        default:
          component = (
            <div key={index}>
              Unknown Condition: {value}
            </div>
          );
      }
      currentBlock.push(component);
    }
  });

  // Handle any remaining components in the current block
  if (currentBlock.length > 0) {
    blocks.push(
      <div key={`block-${blocks.length}`}>
        {currentBlock}
      </div>
    );
  }

  return <div>{blocks}</div>;
}

export default BuildConditionRenderer;
