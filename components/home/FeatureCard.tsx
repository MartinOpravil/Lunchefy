import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="flex w-full max-w-[300px] flex-col items-center gap-6 border-none bg-background px-[30px] py-[50px] text-center">
      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-secondary/70">
        {icon}
      </div>
      <h3 className="text-[26px]">{title}</h3>
      <p className="text-[18px]">{description}</p>
    </Card>
  );
};

export default FeatureCard;
