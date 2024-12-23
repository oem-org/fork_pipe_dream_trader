import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";
import InputSmall from "@/components/ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
import { DndProvider } from "react-dnd";
import DraggableBlock from "@/components/ui/draggable-block";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect, useRef } from "react";
import React from "react";

interface BuildConditionRendererProps {
  conditions: Array<any>;
}

// Dynamically renders and manages draggable strategy conditions,
// tracks their values, and allows reordering with drag and drop.
function BuildConditionRenderer({ conditions }: BuildConditionRendererProps) {
  const conditionService = new BuildConditionsService(conditions);
  conditionService.processConditions();
  const mappedConditions = conditionService.getConditions();
  console.log("RERENDEEEEEEEER");

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
              initialValue={value}
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

  const blockRefs = useRef<JSX.Element[][]>([]);

  // Update the ref when the blocks change, to keep track of the current blocks
  useEffect(() => {
    blockRefs.current = blocks;
  }, [blocks]);

  function logBlockOrder() {
    const blockOrder = blocks.map((_, index) => `block-${index}`);
    console.log("Block Order:", blockOrder);
  }

  // Move a dragged block from one index to another
  function moveBlock(fromIndex: number, toIndex: number) {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      logBlockOrder();
      return updatedBlocks;
    });
  }

  // Handle value changes for different components
  function handleValueChange(blockIndex: number, componentKey: string, newValue: any) {
    setBlocks((prevBlocks) => {
      // Create a new array to ensure immutability
      const updatedBlocks = prevBlocks.map((block, index) => {
        if (index === blockIndex) {
          // Update the block's components
          return block.map((component: any) => {
            if (component.key === blockIndex) {
              // Correctly update the component's value
              return React.cloneElement(component, { initialValue: newValue });
            }
            return component;
          });
        }
        return block;
      });

      return updatedBlocks;
    });
  }

  // Extract values directly from the blocks
  function createConditionString() {
    const values = blocks.flatMap((block) => {
      return block.map((component: any) => {
        // Get the value directly from the component
        if (component.props && component.props.initialValue !== undefined) {
          return component.props.initialValue;
        }
        return null;
      }).filter((value) => value !== null);
    });

    console.log("Values from blocks:", values);
    return values;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {blocks.map((block, blockIndex) => (
          <DraggableBlock key={`block-${blockIndex}`} id={blockIndex} index={blockIndex} moveBlock={moveBlock}>
            {block}
          </DraggableBlock>
        ))}
      </div>
      <button onClick={createConditionString}>Get Sorted Values</button>
    </DndProvider>
  );
}

export default BuildConditionRenderer;
