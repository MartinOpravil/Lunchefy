import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import LoaderSpiner from "@/components/global/LoaderSpinner";
import NoContent from "@/components/global/NoContent";
import PageHeader from "@/components/global/PageHeader";
import React from "react";

const App = () => {
  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <PageHeader
        title="Recipe books"
        icon="recipe_book"
        actionButton={
          <LinkButton title="Add" icon="add" href="/app/new-recipe-book" />
        }
      />
      <main className="h-full flex flex-col items-center justify-center">
        <LoaderSpiner />
        <NoContent
          title="You have no recipe book yet"
          subTitle="Start by creating one"
        />
      </main>
    </main>
  );
};

export default App;
