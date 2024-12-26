import ContinueButton from "@/components/auth/ContinueButton";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card } from "@/components/ui/card";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BookOpenText, CalendarFold, Share, Share2 } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface IndexCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const IndexCard = ({ icon, title, description }: IndexCardProps) => {
  return (
    <Card className="bg-background border-none py-[50px] px-[40px] text-center flex flex-col items-center gap-4 w-full max-w-[300px]">
      <div className="rounded-full bg-secondary/70 w-[100px] h-[100px] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-[22px]">{title}</h3>
      <p>{description}</p>
    </Card>
  );
};

const Home = () => {
  return (
    <main>
      <section className="relative h-[350px] sm:h-[590px] mx-[-100px] rounded-xl overflow-hidden">
        <Image
          src="/images/hero.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-cover"
        />
        <div className="absolute bottom-16 left-0 mx-[100px] max-w-[600px] flex flex-col gap-2">
          <span className="text-primary text-20 sm:text-[28px] uppercase">
            Recipe Manager
          </span>
          <p className="text-20 sm:text-[36px] font-[700]">
            Are you tired of looking your hoarded recipes to find that one you
            truly desire.
          </p>
        </div>
      </section>
      <section className="py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
          <span className="flex gap-2 items-center">
            <span className="logo text-[35px]">Lunchefy</span>
            will keep you covered.
          </span>
        </div>
        <Image
          src="/images/examples.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-contain max-h-[575px]"
        />
      </section>
      <section className="relative py-32 flex flex-col gap-12 justify-center items-center bg-[#F7F7F7] rounded-xl mx-[-100px]">
        <div className="flex gap-4 items-center text-[32px] mx-[100px]">
          <span className="logo text-[60px]">Lunchefy</span>
          <span>is</span>
        </div>
        <div className="flex gap-8 items-between justify-center w-full flex-wrap px-[100px]">
          <IndexCard
            icon={
              <BookOpenText className="text-background !w-[50px] !h-[50px]" />
            }
            title="Recipe manager"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <IndexCard
            icon={
              <CalendarFold className="text-background !w-[50px] !h-[50px]" />
            }
            title="Planner"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <IndexCard
            icon={
              <Share2 className="text-background !w-[50px] !h-[50px] mr-1" />
            }
            title="Sharing platform"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>Recipe manager</h2>
          <span>
            Manage your recipes with ease. Add, edit and share your favorite
            recipes with your family and friends. Create your own recipe books
            divided by focus and share it with your friends and family. Rewrite
            the recipe from paper or take a picture and name it. Then simply
            search for it.
          </span>
          <span className="flex gap-2 items-center">
            <span className="logo text-[35px]">Lunchefy</span>
            is for you.
          </span>
        </div>
        <Image
          src="/images/examples.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-contain max-h-[575px] sm:w-[50%]"
        />
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <Image
          src="/images/examples.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-contain max-h-[575px] sm:w-[50%]"
        />
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>Planner</h2>
          <span>
            Plan your lunches ahead of time. Simply click on calendar and set a
            lunch for that day
          </span>
          <span className="flex gap-2 items-center">
            <span className="logo text-[35px]">Lunchefy</span>
            is for you.
          </span>
        </div>
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>Sharing platform</h2>
          <span>
            Invite your friend and family to share your library and plan
            together lunches for specific days.
          </span>
          <span className="flex gap-2 items-center">
            <span className="logo text-[35px]">Lunchefy</span>
            is for you.
          </span>
        </div>
        <Image
          src="/images/examples.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-contain max-h-[575px] sm:w-[50%]"
        />
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <Image
          src="/images/examples.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-[100%] object-contain max-h-[575px] sm:w-[50%]"
        />
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>More features in the future</h2>
          <span>Some more notable features.</span>
          <span className="flex gap-2 items-center">
            <span className="logo text-[35px]">Lunchefy</span>
            is for you.
          </span>
        </div>
      </section>

      {/* <main className="flex min-h-screen flex-col items-center p-4 py-12 md:p-24 pb-4 md:pb-4 gap-8">
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
            Are you tired of looking through your hoarded recipes to find that
            one you truly desire. <br />
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
            with your friends and family. Rewrite the recipe from paper or take
            a picture and name it. Then simply search for it.
          </p>
        </section>
        <section className="w-full">
          <h3>
            <span className="text-primary">Lunchefy</span> is
          </h3>
          <h2>Recipe decider</h2>
          <p>
            Have you ever had trouble deciding what to make for lunch.
            Who&apos;s always got to figure that out, right? With Lunchify,
            it&apos;s just one click and you&apos;ve made your decision. If you
            know what type it should be (chicken, something with rice, veggies,
            etc..) just enter those criteria and it will take them into account
            when making your decision.
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
      </main> */}
      <section className="bg-[#F7F7F7] py-32 flex flex-col gap-6 text-center items-center mx-[-100px]">
        <div className="flex flex-col items-center gap-4 sm:gap-2 w-full px-[100px]">
          <h2 className="">Interested?</h2>
          <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 items-center">
            Start using
            <span className="logo text-[35px]">Lunchefy</span>
            today
          </div>
          <ContinueButton classList="mt-6 !px-10 !py-6" title="Start using" />
          {/* <>
            <SignedOut>
              <LoginButton />
            </SignedOut>
            <SignedIn>
              <LogoutButton />
            </SignedIn>
          </> */}
        </div>
      </section>
      <section className="pt-16 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="logo text-[60px]">Lunchefy</div>
          <span>Your ultimate recipe manager and planner.</span>
          <div className="w-full pt-4">
            <div className="heading-underline" />
            <section className="pb-8">© Martin Opravil - 2024</section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
