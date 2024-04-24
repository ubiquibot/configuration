import { Type, Static } from "@sinclair/typebox";

const dataPurgeConfigurationType = Type.Object({
  enabled: Type.Boolean({ default: true }),
});

export type DataPurgeConfiguration = Static<typeof dataPurgeConfigurationType>;

export default dataPurgeConfigurationType;
