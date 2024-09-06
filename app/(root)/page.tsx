import ContinueButton from "@/components/auth/ContinueButton";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 py-12 md:p-24 pb-4 md:pb-4 gap-8">
      <section className="flex flex-col gap-2 text-center items-center">
        <h1>Lunchefy</h1>
        <p>
          Your ultimate{" "}
          <strong className="text-secondary">recipe manager</strong> and{" "}
          <strong className="text-secondary">dish decider</strong>.
        </p>
      </section>
      <section className="flex flex-col items-center text-center">
        <p>
          Are you tired of looking through your hoarded recipes to find that one
          you truly desire. <br />
          Do you wish to find your recipe in seconds.
          <br />
          Do you often find yourself unable to decide what to do for lunch?
          <br />
          Do you often find that people bother you with questions about
          what&apos;s for lunch tomorrow or the next day?
          <br />
          <strong className="text-primary">Lunchefy</strong> will keep you
          covered.
        </p>
        <>
          <SignedIn>
            <ContinueButton classList="mt-6" />
          </SignedIn>
          <SignedOut>
            <LoginButton classList="mt-6" />
          </SignedOut>
        </>
      </section>
      <section className="w-full">
        <h3>
          <span className="text-primary">Lunchefy</span> is
        </h3>
        <h2>Recipe manager</h2>
        <p>
          Add, edit and share your favorite recipes with your family and
          friends. Create your own recipe books divided by focus and share it
          with your friends and family. Rewrite the recipe from paper or take a
          picture and name it. Then simply search for it.
        </p>
      </section>
      <section className="w-full">
        <h3>
          <span className="text-primary">Lunchefy</span> is
        </h3>
        <h2>Recipe decider</h2>
        <p>
          Have you ever had trouble deciding what to make for lunch. Who&apos;s
          always got to figure that out, right? With Lunchify, it&apos;s just
          one click and you&apos;ve made your decision. If you know what type it
          should be (chicken, something with rice, veggies, etc..) just enter
          those criteria and it will take them into account when making your
          decision.
        </p>
      </section>
      <section className="w-full">
        <h3>
          <span className="text-primary">Lunchefy</span> is
        </h3>
        <h2>Recipe planner</h2>
        <p>
          Plan your lunches ahead of time. Simply click on calendar and set a
          lunch for that day
        </p>
      </section>
      <section className="flex flex-col gap-2 text-center items-center">
        <h2 className="text-secondary">Interested?</h2>
        <p>
          Start using <strong className="text-primary">Lunchefy</strong>
        </p>
        <>
          <SignedOut>
            <LoginButton />
          </SignedOut>
          <SignedIn>
            <LogoutButton />
          </SignedIn>
        </>
      </section>
      <section className="pt-20">© Martin Opravil - 2024</section>
    </main>
  );
}
