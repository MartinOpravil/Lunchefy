import { toast } from "sonner";

export function notifySuccess(title: string, description?: string | null) {
  toast(title, {
    className: "bg-secondary text-white-1 text-16",
    duration: 5000,
    description,
    style: {
      border: "none",
    },
  });
}

export function notifyError(
  title: string,
  description?: string | null,
  duration: number = 10000,
) {
  toast(title, {
    className: "bg-primary text-white-1 text-16",
    duration,
    description,
    style: {
      border: "none",
    },
  });
}

export function notifyInfo(title: string, description?: string | null) {
  toast(title, {
    className: "bg-accent text-white-1 text-16",
    description,
    duration: 5000,
    style: {
      border: "none",
    },
  });
}
