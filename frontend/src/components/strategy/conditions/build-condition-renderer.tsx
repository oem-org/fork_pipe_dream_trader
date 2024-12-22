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
//dynamically renders and manages draggable strategy conditions, 
//tracks their values, and allows reordering with drag and drop.
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
            component = <SingleOperator
              key={index}
              initialValue={value}
              onValueChange={(newValue) => handleValueChange(index, "singleOperator", newValue)} />;
            break;
          case "indicator":
            component = <IndicatorConditionSelect
              key={index}
              initialValue={value}
              onValueChange={(newValue) => handleValueChange(index, "indicator", newValue)} />;
            break;
          case "operator":
            component = <OperatorConditionSelect
              key={index}
              initialValue={value}
              onValueChange={(newValue) => handleValueChange(index, "operator", newValue)} />;
            break;
          case "value":
            component = <InputSmall
              key={index}
              name="Value"
              onValueChange={(newValue) => handleValueChange(index, "value", newValue)} />;
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

  const [blockValues, setBlockValues] = useState<{ [key: number]: { [key: string]: any } }>({});

  // Update the state value for a component within a block
  const handleValueChange = (blockIndex: number, componentKey: string, newValue: any) => {
    setBlockValues((prevValues) => {
      const updatedValues = { ...prevValues };
      if (!updatedValues[blockIndex]) {
        updatedValues[blockIndex] = {};
      }
      updatedValues[blockIndex][componentKey] = newValue;
      return updatedValues;
    });
  };

  const logBlockOrder = () => {
    const blockOrder = blocks.map((_, index) => `block-${index}`);
    console.log("Block Order:", blockOrder);
  };

  // Move a dragged block from one index to another
  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      logBlockOrder();
      return updatedBlocks;
    });

    // Update blockValues to match the sorting of the blocks in the ui 
    setBlockValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const movedValues = updatedValues[fromIndex];
      delete updatedValues[fromIndex];
      updatedValues[toIndex] = movedValues;
      return updatedValues;
    });
  };

  const getSortedValues = () => {
    const sortedValues = Object.values(blockValues);
    console.log("Sorted Values:", sortedValues);
    return sortedValues;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {blocks.map((block, blockIndex) => (
          <DraggableBlock key={`block-${blockIndex}`} id={blockIndex} index={blockIndex} moveBlock={moveBlock}>
            {block}
          </DraggableBlock>
        ))}
      </div>
      <button onClick={getSortedValues}>Get Sorted Values</button>
    </DndProvider>
  );
}

export default BuildConditionRenderer;
