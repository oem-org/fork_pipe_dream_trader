import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";
import InputSmall from "@/components/ui/forms/input-small";
import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
import { DndProvider } from "react-dnd";
import DraggableBlock from "./draggable-block";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/buttons/button";


interface BuildConditionsRendererProps {
  conditions: Array<any>,
  setConditions: any,
  deleteBlock: any,
}

// TODO: Set types for conditions
//

function BuildConditionRenderer({ conditions, setConditions, deleteBlock }: BuildConditionsRendererProps) {
  const [blocks, setBlocks] = useState<JSX.Element[][]>([]);
  console.log("RERENDER§!")
  //const { conditions, setConditions } = useConditionsStore();
  const [mappedConditions, setMappedConditions] = useState<any>(mapConditions());


  console.log("START", conditions, setConditions)

  function mapConditions() {
    if (!Array.isArray(conditions)) {
      console.log("MAPPED", conditions);

      console.error('Expected conditions to be an array, but got:', typeof conditions)
    }
    const conditionService = new BuildConditionsService(conditions);
    conditionService.processConditions();
    const mapped = conditionService.getConditions();
    return mapped
  }

  useEffect(() => {
    if (conditions.length > 0) {
      const mapped = mapConditions()
      setMappedConditions(mapped)
    }
  }, [conditions])



  useEffect(() => {

    let currentBlock: JSX.Element[] = [];
    const initialBlocks: JSX.Element[][] = [];

    mappedConditions.forEach((condition: any, index: number) => {
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
                id={index}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
              />
            );
            break;
          case "indicator":
            component = (
              <IndicatorConditionSelect
                ref={ref}
                id={index}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
              />
            );
            break;
          case "operator":
            component = (
              <OperatorConditionSelect
                id={index}
                ref={ref}
                key={index}
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
              />
            );
            break;
          case "value":
            component = (
              <InputSmall
                id={index}
                ref={ref}
                key={index}
                name="Value"
                initialValue={value}
                onValueChange={(newValue) => handleValueChange(index, newValue)}
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
  }, [mappedConditions]);

  useEffect(() => {
    console.log("BLOCKS", blocks)

  }, [blocks])


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
    createConditionString()
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

  // TODO: maybe delete
  function deleteCondition(indexToRemove: number) {
    setMappedConditions((prevConditions: any) => {
      const updatedConditions = prevConditions.filter((_: any, index: number) => index !== indexToRemove);
      return updatedConditions;
    });
  }


  function createConditionString() {
    const values = blocks.map((block) => {
      return block.map((component: any) => {
        const value = component.ref.current.getValue();
        return value;
      }).filter((value) => value !== null);
    });
    const transformedValues = transformArray(values)
    //console.log(blocks, "blooooocks")
    console.log("Values from blocks!!!!!!!!!!!!!!!!!!!!!!!:", transformedValues);
    setConditions(transformedValues)
    console.log(conditions, "CONDITIONS")
    return transformedValues;
  };


  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          {blocks.map((block, blockIndex) => (<>
            <DraggableBlock deleteBlock={deleteBlock} key={`block-${blockIndex}`} id={blockIndex} index={blockIndex} moveBlock={moveBlock}>
              {block}

            </DraggableBlock>
          </>))}
        </div>
      </DndProvider>
      <div className="mt-10 z-100">
        <div className="mt-10 z-100">
          <Button onClick={() => console.log(blocks)}>BLOCKS</Button>
        </div>
        <Button onClick={() => createConditionString()}>Get Sorted Values</Button>
      </div>
    </>
  );
}

export default BuildConditionRenderer;
