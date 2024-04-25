import { Type, Static } from "@sinclair/typebox";

export const baseIncentiveConfiguration = Type.Object({
  enabled: Type.Boolean({ default: true }),
});

export type BaseConfiguration = Static<typeof baseIncentiveConfiguration>;
