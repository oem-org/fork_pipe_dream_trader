import SingleOperator from "./single-operator";

import IndicatorConditionSelect from "./indicator-condition-select";
import OperatorConditionSelect from "./operator-condition-select";
import { DndProvider } from "react-dnd";
import DraggableBlock from "./draggable-block";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import React from "react";
import { DivideBlocksService } from "@/lib/services/ComponentMappingService";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import InputSmall from "@/components/ui/forms/input-small";
import { DeleteConditionBtn } from "./delete-condition-btn";

interface CreateConditionStringRef {
  createConditionString: () => Array<Record<string, any> | string>
}

interface BuildConditionsRendererProps {
  conditions: Array<any>,
  ref: React.RefObject<CreateConditionStringRef>;
}

// TODO: Set types for conditions
//

function BuildConditionRenderer({ conditions }: BuildConditionsRendererProps, ref: CreateConditionStringRef) {
  const [blocks, setBlocks] = useState<JSX.Element[][]>([]);
  const { strategyId } = useStrategyStore()
  const [mappedConditions, setMappedConditions] = useState<any>(mapConditions());

  useImperativeHandle(ref, () => ({
    createConditionString,
  }));

  function mapConditions() {
    if (!Array.isArray(conditions)) {

      console.error('Expected conditions to be an array, but got:', typeof conditions)
    }
    const conditionServiceTest = new DivideBlocksService(conditions);
    conditionServiceTest.processConditions()
    let mapp = conditionServiceTest.getConditions()
    //console.log(mapp, "FUCKING MAPPED")
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
        console.log(condition.id, condition, "WTFFF")
        const deleteButton = (
          <DeleteConditionBtn key={`delete-${condition.conditionId}`} conditionId={condition.conditionId} strategyId={strategyId} />
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
    //createConditionString()
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      return updatedBlocks;
    });
  };


  // TODO: maybe delete
  //function deleteCondition(indexToRemove: number) {
  //  setMappedConditions((prevConditions: any) => {
  //    const updatedConditions = prevConditions.filter((_: any, index: number) => index !== indexToRemove);
  //    return updatedConditions;
  //  });
  //}

  // Generate the condition string for the backtest
  // It filter out null values from the buttons which are
  // dynamically generated
  function createConditionString(): Array<Record<string, any> | string> {
    const values = blocks.map((block) => {
      return block
        .map((component: any) => {
          if (component.ref && component.ref.current && typeof component.ref.current.getValue === 'function') {
            return component.ref.current.getValue();
          }
          return null;
        })
        .filter((value) => value !== null);
    });

    console.log(values, "THE VALUES TO TRANSFORM")
    //const transformedValues = transformArray(values);
    return values;
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="w-full">
          {blocks.length > 0 ? (
            blocks.map((block, blockIndex) => (
              <DraggableBlock
                key={`block-${blockIndex}`}
                id={blockIndex}
                index={blockIndex}
                moveBlock={moveBlock}
              >
                {block}
              </DraggableBlock>
            ))
          ) : (
            <div className="text-center text-gray-500">No condtions added.</div>
          )}
        </div>
      </DndProvider>
    </>
  );
}
export default forwardRef(BuildConditionRenderer);
