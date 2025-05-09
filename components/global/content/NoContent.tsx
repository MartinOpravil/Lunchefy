import { cn } from "@/lib/utils";

const NoContent = ({
  title,
  subTitle,
}: {
  title?: string;
  subTitle?: string;
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <h2 className="text-primary">{title}</h2>
      <h3 className={cn({ "text-text2": !title })}>{subTitle}</h3>
    </div>
  );
};

export default NoContent;
