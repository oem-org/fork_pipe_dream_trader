import { Button } from '@/components/ui/buttons/button'
import BuildConditionRenderer from './build-condition-renderer'


export default function ConditionsSection() {

  const defaultConds = [[{ "indicator": null }, { "operator": ">" }, { "value": 1 }], "&", [{ "indicator": null }, { "operator": "=" }, { "indicator": null }]]

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button>Add condition</Button>
        <p>Operators:</p>
        <Button>And</Button>
        <Button>Or</Button>
        <Button>Not</Button>
      </div>
      <hr className='py-1' />
      <div className='flex flex-row'>
        <BuildConditionRenderer conditions={defaultConds} />
      </div>
    </div>
  )
}

