import { useTranslations } from "next-intl";

const GroupListFooter = () => {
  const t = useTranslations();

  return (
    <section className="flex flex-col items-center justify-center gap-2 text-center">
      <div className="mb-1 h-[1px] w-24 bg-accent opacity-50" />
      <h3 className="text-16 text-primary">
        {t("Groups.General.Disclaimer.Title")}
      </h3>
      <div className="text-12 text-text">
        {t("Groups.General.Disclaimer.Text")}
      </div>
    </section>
  );
};

export default GroupListFooter;
