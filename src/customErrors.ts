export class JsonParseError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'JsonParseError';
  }
}

export class PropertiesMissingParseError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PropertiesMissingParseError';
  }
}

export class FileNameMustBeString extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'FileNameMustBeString';
  }
}

