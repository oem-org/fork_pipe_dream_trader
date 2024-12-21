import { Settings } from 'lucide-react'; // Make sure you have the lucide-react package installed

interface SingleOperatorProps {
  initialValue: string;
  //key: number;
}


function SingleOperator({ initialValue }: SingleOperatorProps) {
  let value
  value = initialValue
  function handleClick() {
    console.log("click");

  }

  return (
    <div className="flex items-center relative group">
      <span className="mr-2 cursor-default">{value}</span>
      <Settings
        className="invisible group-hover:visible cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={() => handleClick()}
      />
    </div>
  );
};

export default SingleOperator;
