import { ObjectOptions, Static, StaticDecode, StringOptions, TProperties, Type as T } from "@sinclair/typebox";
import ms from "ms";
import { ajv } from "../utils";
import { contentEvaluatorConfigurationType } from "./configuration/content-evaluator-config";
import { dataPurgeConfigurationType } from "./configuration/data-purge-config";
import { formattingEvaluatorConfigurationType } from "./configuration/formatting-evaluator-config";
import { githubCommentConfigurationType } from "./configuration/github-comment-config";
import { permitGenerationConfigurationType } from "./configuration/permit-generation-configuration";
import { userExtractorConfigurationType } from "./configuration/user-extractor-config";

const promotionComment =
  "###### If you enjoy the DevPool experience, please follow [Ubiquity on GitHub](https://github.com/ubiquity) and star [this repo](https://github.com/ubiquity/devpool-directory) to show your support. It helps a lot!";
const defaultGreetingHeader =
  "Thank you for contributing! Please be sure to set your wallet address before completing your first task so that you can collect your reward.";

export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  INFO = "info",
  VERBOSE = "verbose",
  DEBUG = "debug",
}

const allCommands = ["start", "stop", "help", "query", "ask", "multiplier", "labels", "authorize", "wallet"] as const;

const defaultTimeLabels = ["Time: <1 Hour", "Time: <2 Hours", "Time: <4 Hours", "Time: <1 Day", "Time: <1 Week"];

const defaultPriorityLabels = ["Priority: 1 (Normal)", "Priority: 2 (Medium)", "Priority: 3 (High)", "Priority: 4 (Urgent)", "Priority: 5 (Emergency)"];

function strictObject<T extends TProperties>(obj: T, options?: ObjectOptions) {
  return T.Object<T>(obj, { additionalProperties: false, default: {}, ...options });
}

export function stringDuration(options?: StringOptions) {
  return T.Transform(T.String(options))
    .Decode((value) => {
      const decoded = ms(value);
      if (decoded === undefined || isNaN(decoded)) {
        throw new Error(`Invalid duration string: ${value}`);
      }
      return ms(value);
    })
    .Encode((value) => ms(value));
}

export const envConfigSchema = T.Object({
  WEBHOOK_PROXY_URL: T.Optional(T.String({ format: "uri" })), // optional for production
  LOG_LEVEL: T.Enum(LogLevel, { default: LogLevel.DEBUG }),
  LOG_RETRY_LIMIT: T.Number({ default: 8 }),
  SUPABASE_URL: T.String({ format: "uri" }),
  SUPABASE_KEY: T.String(),
  GITHUB_TOKEN: T.String(),
  X25519_PRIVATE_KEY: T.String(),
  OPENAI_API_KEY: T.String(),
  NFT_MINTER_PRIVATE_KEY: T.String(),
  NFT_CONTRACT_ADDRESS: T.String(),
  PRIVATE_KEY: T.String(),
  APP_ID: T.Number(),
});

export const validateEnvConfig = ajv.compile(envConfigSchema);
export type EnvConfigType = Static<typeof envConfigSchema>;

const botConfigSchema = strictObject(
  {
    keys: strictObject({
      evmPrivateEncrypted: T.Optional(T.String()),
      openAi: T.Optional(T.String()),
    }),
    features: strictObject({
      assistivePricing: T.Boolean({ default: false }),
      defaultLabels: T.Array(T.String(), { default: [] }),
      newContributorGreeting: strictObject({
        enabled: T.Boolean({ default: false }),
        header: T.String({ default: defaultGreetingHeader }),
        displayHelpMenu: T.Boolean({ default: true }),
        footer: T.String({ default: promotionComment }),
      }),
      publicAccessControl: strictObject({
        setLabel: T.Boolean({ default: true }),
        fundExternalClosedIssue: T.Boolean({ default: true }),
      }),
      isNftRewardEnabled: T.Boolean({ default: false }),
    }),
    timers: strictObject({
      reviewDelayTolerance: stringDuration({ default: "1 day" }),
      taskStaleTimeoutDuration: stringDuration({ default: "4 weeks" }),
      taskFollowUpDuration: stringDuration({ default: "0.5 weeks" }),
      taskDisqualifyDuration: stringDuration({ default: "1 week" }),
    }),
    payments: strictObject({
      maxPermitPrice: T.Number({ default: Number.MAX_SAFE_INTEGER }),
      evmNetworkId: T.Number({ default: 1 }),
      basePriceMultiplier: T.Number({ default: 1 }),
      issueCreatorMultiplier: T.Number({ default: 1 }),
    }),
    disabledCommands: T.Array(T.String(), { default: allCommands }),
    incentives: strictObject({
      enabled: T.Boolean({ default: true }),
      contentEvaluator: contentEvaluatorConfigurationType,
      userExtractor: userExtractorConfigurationType,
      dataPurge: dataPurgeConfigurationType,
      formattingEvaluator: formattingEvaluatorConfigurationType,
      permitGeneration: permitGenerationConfigurationType,
      githubComment: githubCommentConfigurationType,
    }),
    labels: strictObject({
      time: T.Array(T.String(), { default: defaultTimeLabels }),
      priority: T.Array(T.String(), { default: defaultPriorityLabels }),
    }),
    miscellaneous: strictObject({
      maxConcurrentTasks: T.Number({ default: Number.MAX_SAFE_INTEGER }),
      promotionComment: T.String({ default: promotionComment }),
      registerWalletWithVerification: T.Boolean({ default: false }),
      openAiTokenLimit: T.Number({ default: 100000 }),
    }),
  },
  { default: undefined } // top level object can't have default!
);
export const validateBotConfig = ajv.compile(botConfigSchema);

export type BotConfig = StaticDecode<typeof botConfigSchema>;
