class ConditionExtractionService {
  constructor(conditions) {
    this.conditions = conditions;
  }

  processConditions() {
    this.conditions.forEach((condition) => {
      this.extract(condition)
      this.blockEnd()
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
  { id: 1, settings: [{ indicator: "SMA_10" }, { operator: ">" }, { value: 1 }] },
  { id: 2, settings: { singleOperator: "&" } },
  { id: 3, settings: [{ indicator: "RSI_14" }, { operator: ">" }, { indicator: "SMA_10" }] },
];

// Using the service
let testt = new BuildConditionsService(input);
testt.processConditions();
console.log(testt.getConditions());










