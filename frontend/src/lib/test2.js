class ConditionExtractionService {
  constructor(conditions) {
    this.conditions = conditions;
  }

  processConditions() {
    this.conditions.forEach((condition) => {
      if ("singleOperator" in condition) {
        console.log("Object has the singleOperator property:", condition.singleOperator);
        this.extract(condition.singleOperator);
        this.blockEnd();

      } else if (Array.isArray(condition)) {
        this.extract(condition)
        this.blockEnd();
      } else {
        console.log("Value is neither a string nor an array:", condition);
      }
    });
  }

  blockEnd() {
    throw new Error("Method 'blockEnd()' must be implemented in the subclass.");
  }

  extract(value) {
    throw new Error("Method 'extract()' must be implemented in the subclass.");
  }

  getConditions() {
    throw new Error("Method 'getConditions()' must be implemented in the subclass.");
  }
}

class BuildConditionsService extends ConditionExtractionService {
  constructor(conditions) {
    super(conditions);
    this.mappedConditions = [];
  }

  blockEnd() {
    this.mappedConditions.push("blockEnd");
  }

  extract(value) {
    this.mappedConditions.push(value);
  }


  getConditions() {
    return this.mappedConditions;
  }
}

// Input
let input = [
  [{ fk_strategy_indicator_id: 2, indicator: "SMA_10" }, { operator: ">" }, { value: 1 }],
  { singleOperator: "&" },
  [{ indicator: "RSI_14" }, { operator: ">" }, { fk_strategy_indicator_id: 2, indicator: "SMA_10" }],
];

// Using the service
let testt = new BuildConditionsService(input);
testt.processConditions();
console.log(testt.getConditions());
