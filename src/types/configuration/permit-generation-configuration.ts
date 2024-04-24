import { Static, Type } from "@sinclair/typebox";

export const permitGenerationConfigurationType = Type.Object({
  enabled: Type.Boolean(),
});

export type PermitGenerationConfiguration = Static<typeof permitGenerationConfigurationType>;
