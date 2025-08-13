import type { LucideIcon } from "lucide-react";
interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
}
export declare const StatsCard: (({ title, value, description, icon: Icon, trend }: StatsCardProps) => import("react").JSX.Element) & {
    Skeleton: () => import("react").JSX.Element;
};
export {};
