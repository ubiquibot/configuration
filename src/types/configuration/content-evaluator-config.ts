import { Static, Type } from "@sinclair/typebox";

export const contentEvaluatorConfigurationType = Type.Object({
  enabled: Type.Boolean(),
});

export type ContentEvaluatorConfiguration = Static<typeof contentEvaluatorConfigurationType>;
