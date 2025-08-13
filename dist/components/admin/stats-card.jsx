"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsCard = void 0;
const card_1 = require("@/components/ui/card");
const skeleton_1 = require("@/components/ui/skeleton");
const StatsCardComponent = ({ title, value, description, icon: Icon, trend }) => {
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <card_1.CardTitle className="text-sm font-medium">{title}</card_1.CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground"/>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (<p className="text-xs text-muted-foreground">
            <span className={trend.value > 0 ? "text-green-600" : "text-red-600"}>
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>{" "}
            {trend.label}
          </p>)}
      </card_1.CardContent>
    </card_1.Card>);
};
const StatsCardSkeleton = () => {
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <skeleton_1.Skeleton className="h-4 w-20"/>
        <skeleton_1.Skeleton className="h-4 w-4"/>
      </card_1.CardHeader>
      <card_1.CardContent>
        <skeleton_1.Skeleton className="h-8 w-12"/>
        <skeleton_1.Skeleton className="h-3 w-40 mt-1"/>
      </card_1.CardContent>
    </card_1.Card>);
};
exports.StatsCard = Object.assign(StatsCardComponent, {
    Skeleton: StatsCardSkeleton,
});
