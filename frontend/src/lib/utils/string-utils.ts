import { LogicalOperator } from "@/interfaces/Condition";

export function findStringIndex(stringToFind: string, stringArray: Array<string>): number {

  const index = stringArray.indexOf(stringToFind);

  if (index === -1) {
    return -1
  }
  return index
}


export function isLogicalOperator(value: any): value is LogicalOperator {
  return ["&", "|", "~", "<", ">", "="].includes(value);
}


export function removeSurroundingQuotes(str: string) {
  return str.replace(/^"(.*)"$/, '$1');
}


export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date.toLocaleString() : "";
};
