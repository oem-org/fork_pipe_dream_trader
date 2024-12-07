import Strategy from "../Strategy";  // Import the Strategy interface

export default interface CreateStrategyRequest extends Omit<Strategy, 'id'> {
}
