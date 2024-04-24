import { Type, Static } from "@sinclair/typebox";

const baseIncentiveConfiguration = Type.Object({
  enabled: Type.Boolean({ default: true }),
});

export type BaseConfiguration = Static<typeof baseIncentiveConfiguration>;

export default baseIncentiveConfiguration;
