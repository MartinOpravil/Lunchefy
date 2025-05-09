import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

import { OrderBy } from "@/enums";

interface SettingsRadioItemProps {
  value: OrderBy;
  icon: React.ReactNode;
  label: string;
}

const SettingsRadioItem = ({ value, icon, label }: SettingsRadioItemProps) => {
  return (
    <DropdownMenuRadioItem value={value}>
      <div className="flex items-center gap-2">
        {icon} {label}
      </div>
    </DropdownMenuRadioItem>
  );
};

export default SettingsRadioItem;
