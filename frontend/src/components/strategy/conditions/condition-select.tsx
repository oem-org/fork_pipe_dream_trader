import BuildConditionRenderer from "./build-condition-renderer";



export default function ConditionSelect() {


  const operators = [{ "id": 1, "name": "=" }, { "id": 2, "name": "<" }];

  //

  const defaultConds = [[{ "indicator": "SMA_10" }, { "operator": ">" }, { "value": 1 }], "&", [{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_10" }]]



  return (
    <>
      <BuildConditionRenderer conditions={defaultConds} />
    </>);
};

