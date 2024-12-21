export default class ConditionExtractionService {
  conditions: Array<any>;

  constructor(conditions: Array<any>) {
    this.conditions = conditions;
  }

  processConditions() {
    this.conditions.forEach((condition: Array<any> | string) => {
      if (typeof condition === "string") {
        console.log("Value is a string:", condition);
        this.extract("singleOperator", condition);
        this.blockEnd()
      } else if (Array.isArray(condition)) {
        condition.forEach((inner) => {
          if (typeof inner === "object" && inner !== null) {
            if ("value" in inner) {
              //console.log("Inner object represents a value:", inner);
              this.extract("value", inner['value']);
            } else if ("indicator" in inner) {
              //console.log("Inner object represents an indicator:", inner);
              this.extract("indicator", inner['indicator']);
            } else if ("operator" in inner) {
              //console.log("Inner object represents an operator:", inner);
              this.extract("operator", inner['operator']); // Fixed key spelling from 'oprator' to 'operator'
            } else {
              console.log("Inner object is unknown:", inner);
            }
          } else {
            console.log("Inner value is of a wrong type:", inner);
          }
        });
        this.blockEnd()
      } else {
        console.log("Value is neither a string nor an array:", condition);
      }
    });
  }
  blockEnd(): void {
  }
  extract(kind: string, value: string): void {
    console.log(kind, value);
    throw new Error("Method 'extract()' must be implemented in the subclass.");
  }

  getConditions(): Array<any> {
    throw new Error("Method 'getConditions()' must be implemented in the subclass.");
  }
}



export class BuildConditionsService extends ConditionExtractionService {
  private mappedConditions: Array<[string, string] | string>;

  constructor(conditions: Array<any>) {
    super(conditions);
    this.mappedConditions = [];
  }

  blockEnd(): void {
    this.mappedConditions.push("blockEnd")
  }

  extract(kind: string, value: string): void {
    this.mappedConditions.push([kind, value]);
  }

  getConditions(): Array<[string, string] | string> {
    return this.mappedConditions;
  }
}
