import { Side, LogicalOperator, CreateConditionRequest } from "@/interfaces/Condition"
import CreateIndicatorIndicatorModal from "./indicator-indicator-modal"
import CreateIndicatorValueModal from "./indicator-value-modal"
import { Button } from "@/components/ui/buttons/button"
interface CreateConditionsProps {
  addCondition: (cond: LogicalOperator | CreateConditionRequest) => void
  side: Side
}

export default function CreateConditions({ side, addCondition }: CreateConditionsProps) {


  function createOperator(side: Side, operator: LogicalOperator) {
    const cond: CreateConditionRequest = {
      "side": side,
      "fk_strategy_indicator_id_1": null,
      "fk_strategy_indicator_id_2": null,
      "settings": { "singleOperator": operator }
    }
    console.log(cond)
    return cond
  }
  return (
    <>
      <div>
        <CreateIndicatorIndicatorModal side={side} addCondition={addCondition} />
        <CreateIndicatorValueModal side={side} addCondition={addCondition} />

        <div className="mt-4 flex flex-row">
          <Button onClick={() => addCondition(createOperator(side, "&"))}> &amp; </Button>
          <Button onClick={() => addCondition(createOperator(side, "|"))}>|</Button>
          <Button onClick={() => addCondition(createOperator(side, "~"))}>~</Button>
          <Button onClick={() => addCondition(createOperator(side, ">"))}>{'>'}</Button>
          <Button onClick={() => addCondition(createOperator(side, "<"))}>{'<'}</Button>
        </div>
      </div>
    </>
  );
}




//<button onClick={() => toggleIndicatorValue()} className="btn-dropdown">Rename</button>

//return (<>
//
//
//  <div className="mt-4 flex flex-row">
//  </div>
//  <div className="mt-4 flex flex-row">
//    <Button onClick={() => addCondition("&")}> &amp; </Button>
//    <Button onClick={() => addCondition("|")}>|</Button>
//    <Button onClick={() => addCondition("~")}>~</Button>
//    <Button onClick={() => addCondition(">")}>{'>'}</Button>
//    <Button onClick={() => addCondition("<")}>{'<'}</Button>
//  </div>
//
//</>)
//

//<Button onClick={() => addCondition([{ "value": 1 }, { "operator": ">" }, { "indicator": null }])}>Value/Indicator</Button>
//<Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Indicator/Value</Button>
//<Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "indicator": null }])}>Indicator/Indicator</Button>
