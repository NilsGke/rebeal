export class AuthRequiredError extends Error {
  constructor(message: string = "you need to be logged in to see this page") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
