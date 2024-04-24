import { Type, Static } from "@sinclair/typebox";

export const dataPurgeConfigurationType = Type.Object({
  enabled: Type.Boolean({ default: true }),
});

export type DataPurgeConfiguration = Static<typeof dataPurgeConfigurationType>;
