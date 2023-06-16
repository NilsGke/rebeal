export class ElementDoesNotExistError extends Error {
  constructor(message: string = "Element not found in DOM") {
    super(message);
    this.name = "ElementDoesNotExistError";
  }
}
