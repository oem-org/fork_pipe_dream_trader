import { Button } from '@/components/ui/buttons/button'
import ConditionSelect from './condition-select'
import InputSmall from '../../ui/forms/input-small'


export default function ConditionsSection() {
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
        <ConditionSelect />
      </div>
    </div>
  )
}

