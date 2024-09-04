import LoaderSpiner from "@/components/global/LoaderSpinner";
import NoContent from "@/components/global/NoContent";
import PageHeader from "@/components/global/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const App = () => {
  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <PageHeader
        title="Recipe book"
        icon="recipe_book"
        actionButton={<Button>Add</Button>}
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
