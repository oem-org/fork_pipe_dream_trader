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
import { Button } from "@/components/ui/buttons/button";



// TODO: Set types for conditions
//
interface BuildConditionRendererProps {
  conditions: Array<any>;

  setConditions: React.Dispatch<React.SetStateAction<any>>;
}

function BuildConditionRenderer({ conditions, setConditions }: BuildConditionRendererProps) {
  const [blocks, setBlocks] = useState<JSX.Element[][]>([]);

  useEffect(() => {
    const conditionService = new BuildConditionsService(conditions);
    conditionService.processConditions();
    const mappedConditions = conditionService.getConditions();

    let currentBlock: JSX.Element[] = [];
    const initialBlocks: JSX.Element[][] = [];

    mappedConditions.forEach((condition, index) => {
      if (condition === "blockEnd") {
        initialBlocks.push(currentBlock);
        currentBlock = [];
      } else {
        const [kind, value] = condition as [string, string];
        let component: JSX.Element;
        const ref = React.createRef();

        switch (kind) {
          case "singleOperator":
            component = (
              <SingleOperator
                ref={ref}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
                onDelete={() => deleteBlock(index)}
              />
            );
            break;
          case "indicator":
            component = (
              <IndicatorConditionSelect
                ref={ref}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
                onDelete={() => deleteBlock(index)}
              />
            );
            break;
          case "operator":
            component = (
              <OperatorConditionSelect
                ref={ref}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
                onDelete={() => deleteBlock(index)}
              />
            );
            break;
          case "value":
            component = (
              <InputSmall
                ref={ref}
                key={index}
                name="Value"
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
                onDelete={() => deleteBlock(index)}
              />
            );
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

    setBlocks(initialBlocks);
  }, [conditions]);

  const deleteBlock = (blockIndex: number) => {
    console.log("Deleting block index:", blockIndex);

    setBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.filter((_, index) => index !== blockIndex);
      return updatedBlocks;
    });

    createConditionString();
  };

  useEffect(() => {
  }, [blocks]);


  const handleValueChange = (blockIndex: number, newValue: any) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.map((block, index) => {
        if (index === blockIndex) {
          return block.map((component: any) => {
            if (component.key === blockIndex) {
              return React.cloneElement(component, { initialValue: newValue });
            }
            return component;
          });
        }
        return block;
      });
      return updatedBlocks;
    });
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      return updatedBlocks;
    });
  };


  // Transform back to the format of conditions state
  function transformArray(inputArray: any) {
    let result = [];

    for (let i = 0; i < inputArray.length; i++) {
      let currentElement = inputArray[i];

      if (currentElement[0] && currentElement[0].hasOwnProperty('singleOperator')) {
        result.push(currentElement[0].singleOperator);

      } else {
        result.push(currentElement);
      }
    }

    return result;
  }

  const createConditionString = () => {
    const values = blocks.map((block) => {
      return block.map((component: any) => {
        const value = component.ref.current.getValue();
        return value;
      }).filter((value) => value !== null);
    });
    const transformedValues = transformArray(values)
    //console.log(blocks, "blooooocks")
    console.log("Values from blocks:", transformedValues);
    setConditions(transformedValues)
    return transformedValues;
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          {blocks.map((block, blockIndex) => (
            <DraggableBlock key={`block-${blockIndex}`} id={blockIndex} index={blockIndex} moveBlock={moveBlock}>
              {block}
            </DraggableBlock>
          ))}
        </div>
      </DndProvider>
      <div className="mt-10 z-100">
        <Button onClick={createConditionString}>Get Sorted Values</Button>
      </div>
    </>
  );
}

export default BuildConditionRenderer;
