export enum Privilage {
  Owner = "Owner",
  Editor = "Editor",
  Viewer = "Viewer",
}

export enum HttpResponseCode {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  ClientCancelled = 499,
  InternalServerError = 500,
}

export enum ButtonVariant {
  // Default = "default",
  Negative = "negative",
  Positive = "positive",
  Minimalistic = "minimalistic",
  Editor = "editor",
}
