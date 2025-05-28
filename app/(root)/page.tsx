import { useTranslations } from "next-intl";
import Image from "next/image";

import { SignedIn } from "@clerk/nextjs";
import { BookOpenText, CalendarFold, CookingPot, Share2 } from "lucide-react";

import LinkButton from "@/components/global/button/LinkButton";
import FeatureCard from "@/components/home/FeatureCard";

import { ButtonVariant } from "@/enums";

const Home = () => {
  const t = useTranslations("HomePage");

  return (
    <main className="homepage">
      <section className="hero">
        <Image
          src="/images/hero.webp"
          alt="hero image"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute z-0 h-[100%] w-[100%] object-cover"
        />
        <div className="z-10 flex h-full w-full flex-col justify-end pb-12 pt-40 lg:py-16">
          <div className="relative flex max-w-[600px] flex-col gap-2">
            <span className="text-14 font-[700] uppercase tracking-wider text-primary sm:text-[20px]">
              {t("Hero.subTitle")}
            </span>
            <p className="text-20 whitespace-pre-line font-[700] text-black-1 sm:text-[36px]">
              {t("Hero.title")}
            </p>
            <SignedIn>
              <LinkButton
                classList="mt-6 !px-10 !py-6 uppercase"
                title={t("Hero.buttonText")}
                href="/app"
                variant={ButtonVariant.Positive}
              />
            </SignedIn>
          </div>
        </div>
      </section>
      <section className="normal-section">
        <div className="section-content sm:w-[50%]">
          <h2>{t("General.title")}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("General.text"),
            }}
          />
        </div>
        <Image
          src="/images/recipe.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="section-image"
        />
      </section>
      <section className="wider-section !gap-12">
        <div
          className="h3 flex items-center text-[30px] md:text-[36px]"
          dangerouslySetInnerHTML={{
            __html: t.raw("Features.title"),
          }}
        />

        <div className="flex w-full flex-wrap justify-center gap-8">
          <FeatureCard
            icon={<BookOpenText className="feature-icon" />}
            title={t("Features.Manager.title")}
            description={t("Features.Manager.description")}
          />
          <FeatureCard
            icon={<CalendarFold className="feature-icon" />}
            title={t("Features.Planner.title")}
            description={t("Features.Planner.description")}
          />
          <FeatureCard
            icon={<Share2 className="feature-icon mr-1" />}
            title={t("Features.SharingPlatform.title")}
            description={t("Features.SharingPlatform.description")}
          />
        </div>
      </section>
      <section className="normal-section">
        <div className="section-content">
          <h2>{t("RecipeManager.title")}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("RecipeManager.text"),
            }}
          />
        </div>
        <Image
          src="/images/group.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="section-image"
        />
      </section>
      <section className="normal-section">
        <div className="section-content md:order-2">
          <h2>{t("Planner.title")}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("Planner.text"),
            }}
          />
        </div>
        <Image
          src="/images/planner.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="section-image md:order-1"
        />
      </section>
      <section className="normal-section">
        <div className="section-content">
          <h2>{t("SharingPlatform.title")}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("SharingPlatform.text"),
            }}
          />
        </div>
        <Image
          src="/images/share.webp"
          alt="recipe image"
          width={0}
          height={0}
          sizes="100vw"
          className="section-image"
        />
      </section>
      <section className="normal-section !pb-32 lg:!pb-48 lg:!pt-32">
        <div className="section-content !gap-8 md:order-2">
          <h2>{t("Next.title")}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("Next.text"),
            }}
          />
        </div>
        <div className="section-image md:order-1">
          <CookingPot className="m-auto !h-[200px] !w-[200px] text-secondary" />
        </div>
      </section>
      <section className="wider-section">
        <div className="flex w-full flex-col items-center gap-4 px-[100px] sm:gap-2">
          <h2 className="">{t("Banner.title")}</h2>
          <div
            className="flex flex-col items-center gap-x-4 gap-y-2 sm:flex-row"
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
      <section className="footer-section">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <div className="logo text-[60px]">Lunchefy</div>
          <div
            dangerouslySetInnerHTML={{
              __html: t.raw("Footer.text"),
            }}
          />
          <div className="w-full pt-4">
            <div className="heading-underline" />
            <section className="pb-8 text-center">{`© Martin Opravil - ${new Date().getFullYear()}`}</section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
