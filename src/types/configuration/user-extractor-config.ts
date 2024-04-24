import { Static, Type } from "@sinclair/typebox";

export const userExtractorConfigurationType = Type.Object({
  enabled: Type.Boolean({ default: true }),
  redeemTask: Type.Boolean({ default: true }),
});

export type UserExtractorConfiguration = Static<typeof userExtractorConfigurationType>;
