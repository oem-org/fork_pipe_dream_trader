import { BuildConditionsService } from "@/lib/services/ConditionExtractionService";
import SingleOperator from "./single-operator";

import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
import { DndProvider } from "react-dnd";
import DraggableBlock from "./draggable-block";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/buttons/button";
import { DivideBlocksService } from "@/lib/services/ComponentMappingService";
import { useDeleteStrategyCondition } from "@/lib/hooks/useDeleteStrategyCondition";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import InputSmall from "@/components/ui/forms/input-small";

interface BuildConditionsRendererProps {
  conditions: Array<any>,
  setConditions: any,
}

// TODO: Set types for conditions
//

function BuildConditionRenderer({ conditions, setConditions }: BuildConditionsRendererProps) {
  const [blocks, setBlocks] = useState<JSX.Element[][]>([]);
  const { mutateAsync: deleteCondition } = useDeleteStrategyCondition()
  const { strategyId } = useStrategyStore()
  console.log("RERENDER§!")
  //const { conditions, setConditions } = useConditionsStore();
  const [mappedConditions, setMappedConditions] = useState<any>(mapConditions());



  function mapConditions() {
    if (!Array.isArray(conditions)) {

      console.error('Expected conditions to be an array, but got:', typeof conditions)
    }
    console.log("COOOOOOOOOOOOOOOOOOONDITIONS", conditions)
    const conditionServiceTest = new DivideBlocksService(conditions);
    conditionServiceTest.processConditions()
    let mapp = conditionServiceTest.getConditions()
    console.log(mapp, "FUCKING MAPPED")
    return mapp
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
      if ("conditionId" in condition) {
        console.log(condition.id, condition)
        const deleteButton = (
          <button key={`delete-${condition.conditionId}`} onClick={() => handleDeleteCondition(condition.conditionId)}>
            DEEEL
          </button>
        );
        currentBlock.push(deleteButton)
        initialBlocks.push(currentBlock);
        currentBlock = [];

      } else {

        const [kind, value, id] = condition as [string, string, number];
        let component: JSX.Element;
        const ref = React.createRef();
        switch (kind) {
          case "singleOperator":
            component = (
              <SingleOperator
                conditionId={id}
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
                conditionId={id}
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
                conditionId={id}
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
                conditionId={id}
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

  //useEffect(() => {
  //  console.log("BLOCKS", blocks)
  //
  //}, [blocks])


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
  //function deleteCondition(indexToRemove: number) {
  //  setMappedConditions((prevConditions: any) => {
  //    const updatedConditions = prevConditions.filter((_: any, index: number) => index !== indexToRemove);
  //    return updatedConditions;
  //  });
  //}


  function createConditionString() {
    const values = blocks.map((block) => {
      return block
        .map((component: any) => {
          // Check if the component has a ref and it is defined
          if (component.ref && component.ref.current && typeof component.ref.current.getValue === 'function') {
            return component.ref.current.getValue();
          }
          return null; // Skip components without a valid ref
        })
        .filter((value) => value !== null); // Filter out null values
    });

    const transformedValues = transformArray(values);
    console.log("Values from blocks!!!!!!!!!!!!!!!!!!!!!!!:", transformedValues);
    //setConditions(transformedValues);
    console.log(conditions, "CONDITIONS");
    return transformedValues;
  }

  async function handleDeleteCondition(conditionId: number) {
    await deleteCondition({ strategyId, conditionId })
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          {blocks.map((block, blockIndex) => (
            <>
              <DraggableBlock key={`block-${blockIndex}`} id={blockIndex} index={blockIndex} moveBlock={moveBlock}>
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
