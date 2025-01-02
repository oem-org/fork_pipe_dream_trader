
export function findStringIndex(stringToFind: string, stringArray: Array<string>): number {

  const index = stringArray.indexOf(stringToFind);

  if (index === -1) {
    return -1
  }
  return index
}

export function isLogicalOperator(value: any): boolean {
  const validOperators = ["&", "|", "~", "<", ">", "="];

  if (!validOperators.includes(value)) {
    throw new Error(`Invalid logical operator: ${value}`);
  }

  return true;
}
