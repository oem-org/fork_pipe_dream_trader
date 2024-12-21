import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";
import InputSmall from "@/components/ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
import { DndProvider } from "react-dnd";
import DraggableBlock from "@/components/ui/draggable-block";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";

interface BuildConditionRendererProps {
  conditions: Array<any>;
}

function BuildConditionRenderer({ conditions }: BuildConditionRendererProps) {
  const conditionService = new BuildConditionsService(conditions);
  conditionService.processConditions();
  const mappedConditions = conditionService.getConditions();

  const [blocks, setBlocks] = useState<JSX.Element[][]>(() => {
    let currentBlock: JSX.Element[] = [];
    const initialBlocks: JSX.Element[][] = [];

    mappedConditions.forEach((condition, index) => {
      if (condition === "blockEnd") {
        initialBlocks.push(currentBlock);
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

    if (currentBlock.length > 0) {
      initialBlocks.push(currentBlock);
    }

    return initialBlocks;
  });

  const logBlockOrder = () => {
    const blockOrder = blocks.map((_, index) => `block-${index}`);
    console.log("Block Order:", blockOrder);
  };


  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      logBlockOrder()
      return updatedBlocks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {blocks.map((block, index) => (
          <DraggableBlock key={`block-${index}`} id={index} index={index} moveBlock={moveBlock}>
            {block}
          </DraggableBlock>
        ))}
      </div>
    </DndProvider>
  );
}

export default BuildConditionRenderer;
