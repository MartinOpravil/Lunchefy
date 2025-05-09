import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

interface SettingsCheckboxItemProps {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ReactNode;
  label: string;
}

const SettingsCheckboxItem = ({
  value,
  setValue,
  icon,
  label,
}: SettingsCheckboxItemProps) => {
  return (
    <DropdownMenuCheckboxItem checked={value} onCheckedChange={setValue}>
      <div className="flex items-center gap-2">
        {icon} {label}
      </div>
    </DropdownMenuCheckboxItem>
  );
};

export default SettingsCheckboxItem;
