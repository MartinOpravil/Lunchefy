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
  Editor = "editor",
  Minimalistic = "minimalistic",
  NegativeMinimalistic = "negative_minimalistic",
  Positive = "positive",
  Negative = "negative",
}

export enum PlannerAge {
  Latest = "Latest",
  OneWeek = "One week",
  TwoWeeks = "Two weeks",
  ThreeWeeks = "Three weeks",
  OneMonth = "One month",
}

export enum SearchBy {
  Name = "name",
  Tags = "tags",
  Planner = "planner",
}

export enum OrderBy {
  NameAscend = "nameAscend",
  NameDescend = "nameDescend",
  CreationDateAscend = "creationDateAscend",
  CreationDateDescend = "creationDateDescend",
}

export enum RecipePlannerAction {
  Assign = "assign",
  Swap = "swap",
  Remove = "remove",
}
