import { ConditionGroup, LogicalOperator } from '@/interfaces/Condition'
import React from 'react'
import { Button } from '@/components/ui/buttons/button'

interface ConditionsButtonGroupProps {
  addCondition: (cond: LogicalOperator | ConditionGroup) => void

}

export default function ConditionsButtonGroup({ addCondition }: ConditionsButtonGroupProps) {
  return (<>


    <div className="mt-4 flex flex-row">
      <Button onClick={() => addCondition([{ "value": 1 }, { "operator": ">" }, { "indicator": null }])}>Value/Indicator</Button>
      <Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Indicator/Value</Button>
      <Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "indicator": null }])}>Indicator/Indicator</Button>
    </div>
    <div className="mt-4 flex flex-row">
      <Button onClick={() => addCondition("&")}> &amp; </Button>
      <Button onClick={() => addCondition("|")}>|</Button>
      <Button onClick={() => addCondition("~")}>~</Button>
      <Button onClick={() => addCondition(">")}>{'>'}</Button>
      <Button onClick={() => addCondition("<")}>{'<'}</Button>
    </div>

  </>)
}

