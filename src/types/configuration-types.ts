import { ObjectOptions, Static, StaticDecode, StringOptions, TProperties, Type as T } from "@sinclair/typebox";
import ms from "ms";
import { StandardValidator } from "typebox-validators";
import { pluginConfigurationSchema } from "./configuration/plugin-configuration";

export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  INFO = "info",
  VERBOSE = "verbose",
  DEBUG = "debug",
}

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

export const validateEnvConfig = new StandardValidator(envConfigSchema);
export type EnvConfigType = Static<typeof envConfigSchema>;

export const botConfigSchema = strictObject(
  {
    plugins: pluginConfigurationSchema,
  },
  { default: undefined } // top level object can't have default!
);
export const validateBotConfig = new StandardValidator(botConfigSchema);

export type BotConfig = StaticDecode<typeof botConfigSchema>;
