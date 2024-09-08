"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";

const TestingElement = (props: {
  preloadedTasks: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const preloadedTasksResult = usePreloadedQuery(props.preloadedTasks);
  return <div>Testing element {preloadedTasksResult.name}</div>;
};

export default TestingElement;
