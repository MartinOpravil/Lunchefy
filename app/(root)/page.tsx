import ContinueButton from "@/components/auth/ContinueButton";
import LoginButton from "@/components/auth/LoginButton";
import LogoutButton from "@/components/auth/LogoutButton";
import LinkButton from "@/components/global/LinkButton";
import { Card } from "@/components/ui/card";
import { ButtonVariant } from "@/enums";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BookOpenText, CalendarFold, Share, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ReactNode } from "react";

interface IndexCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const IndexCard = ({ icon, title, description }: IndexCardProps) => {
  return (
    <Card className="bg-background border-none py-[50px] px-[30px] text-center flex flex-col items-center w-full max-w-[300px]">
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="rounded-full bg-secondary/70 w-[100px] h-[100px] flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-[26px] h-[50px]">{title}</h3>
      </div>
      <p className="text-[18px]">{description}</p>
    </Card>
  );
};

const Home = () => {
  const t = useTranslations("HomePage");
  return (
    <main className="homepage">
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
          <span className="text-primary text-18 sm:text-[20px] uppercase font-[700] tracking-wider">
            {t("Hero.subTitle")}
          </span>
          <p className="text-20 sm:text-[36px] font-[700]">{t("Hero.title")}</p>
          <SignedIn>
            <LinkButton
              classList="mt-6 !px-10 !py-6 uppercase"
              title={t("Hero.buttonText")}
              href="/app"
              variant={ButtonVariant.Positive}
            />
          </SignedIn>
        </div>
      </section>
      <section className="py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6 sm:w-[50%]">
          <h2>{t("General.title")}</h2>
          <div
            className="flex flex-col gap-6 leading-7"
            dangerouslySetInnerHTML={{
              __html: t.raw("General.text"),
            }}
          />
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
      <section className="relative py-32 flex flex-col gap-12 justify-center items-center bg-[#F7F7F7] rounded-xl mx-[-100px]">
        <div
          className="flex gap-4 items-center text-[32px] mx-[100px]"
          dangerouslySetInnerHTML={{
            __html: t.raw("Features.title"),
          }}
        />

        <div className="flex gap-8 items-between justify-center w-full flex-wrap px-[100px]">
          <IndexCard
            icon={
              <BookOpenText className="text-background !w-[50px] !h-[50px]" />
            }
            title={t("Features.Manager.title")}
            description={t("Features.Manager.description")}
          />
          <IndexCard
            icon={
              <CalendarFold className="text-background !w-[50px] !h-[50px]" />
            }
            title={t("Features.Planner.title")}
            description={t("Features.Planner.description")}
          />
          <IndexCard
            icon={
              <Share2 className="text-background !w-[50px] !h-[50px] mr-1" />
            }
            title={t("Features.SharingPlatform.title")}
            description={t("Features.SharingPlatform.description")}
          />
        </div>
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>{t("RecipeManager.title")}</h2>
          <div
            className="flex flex-col gap-6 leading-7"
            dangerouslySetInnerHTML={{
              __html: t.raw("RecipeManager.text"),
            }}
          />
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
          <h2>{t("Planner.title")}</h2>
          <div
            className="flex flex-col gap-6 leading-7"
            dangerouslySetInnerHTML={{
              __html: t.raw("Planner.text"),
            }}
          />
        </div>
      </section>
      <section className="relative py-32 flex flex-col items-center sm:flex-row gap-16">
        <div className="flex flex-col gap-6 w-full sm:w-[50%]">
          <h2>{t("SharingPlatform.title")}</h2>
          <div
            className="flex flex-col gap-6 leading-7"
            dangerouslySetInnerHTML={{
              __html: t.raw("SharingPlatform.text"),
            }}
          />
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
        <div className="flex flex-col gap-8 w-full sm:w-[50%]">
          <h2>{t("Next.title")}</h2>
          <div
            className="flex flex-col gap-6 leading-7"
            dangerouslySetInnerHTML={{
              __html: t.raw("Next.text"),
            }}
          />
        </div>
      </section>

      <section className="bg-[#F7F7F7] py-32 flex flex-col gap-6 text-center items-center mx-[-100px]">
        <div className="flex flex-col items-center gap-4 sm:gap-2 w-full px-[100px]">
          <h2 className="">{t("Banner.title")}</h2>
          <div
            className="flex flex-col sm:flex-row gap-x-4 gap-y-2 items-center"
            dangerouslySetInnerHTML={{
              __html: t.raw("Banner.text"),
            }}
          />

          <LinkButton
            classList="mt-6 !px-10 !py-6 uppercase"
            title={t("Banner.buttonText")}
            href="/app"
            variant={ButtonVariant.Positive}
          />
        </div>
      </section>
      <section className="pt-16 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="logo text-[60px]">Lunchefy</div>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("Footer.text"),
            }}
          />
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
