export class ResourceNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundException';
  }
}

export class RunTimeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RunTimeException';
  }
}