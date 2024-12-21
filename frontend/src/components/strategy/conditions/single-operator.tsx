import { Settings } from 'lucide-react'; // Make sure you have the lucide-react package installed

interface SingleOperatorProps {
  value: string;
  key: number;
}


function SingleOperator({ value, key }: SingleOperatorProps) {

  function handleClick() {
    console.log("click");

  }

  return (
    <div key={key} className="flex items-center relative group">
      <span className="mr-2 cursor-default">{value}</span>
      <Settings
        className="invisible group-hover:visible cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={() => handleClick()}
      />
    </div>
  );
};

export default SingleOperator;
