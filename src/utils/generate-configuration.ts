import { Value } from "@sinclair/typebox/value";
import mergeWith from "lodash/merge";
import YAML from "yaml";
import { BotConfig, botConfigSchema, stringDuration, validateBotConfig } from "../types";
// @ts-expect-error gets transformed by rollup
import orgConfig from "../../.github/.ubiquibot-config.yml";
import { githubPluginType } from "../types/configuration/plugin-configuration";

export function generateConfiguration(repoConfig?: BotConfig): BotConfig {
  const defaultConfig = Value.Default(botConfigSchema, {}) as BotConfig;

  const merged = mergeWith(defaultConfig, orgConfig, repoConfig, (objValue: unknown, srcValue: unknown) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      // if it's string array, concat and remove duplicates
      if (objValue.every((value) => typeof value === "string")) {
        return [...new Set(objValue.concat(srcValue))];
      }
      // otherwise just concat
      return objValue.concat(srcValue);
    }
  });

  if (!validateBotConfig.test(merged)) {
    const errors = validateBotConfig.errors(merged);
    for (const error of errors) {
      console.error(error);
    }
    throw new Error("Invalid configuration.");
  }

  // this will run transform functions
  try {
    transformConfig(merged);
  } catch (err) {
    console.error(`Could not transform the configuration: ${err}`);
    throw err;
  }
  return merged as BotConfig;
}

// Transforming the config only works with Typebox and not Ajv
// When you use Decode() it not only transforms the values but also validates the whole config and Typebox doesn't return all errors so we can filter for correct ones
// That's why we have transform every field manually and catch errors
export function transformConfig(config: BotConfig) {
  let errorMsg = "";
  try {
    config.timers.reviewDelayTolerance = Value.Decode(stringDuration(), config.timers.reviewDelayTolerance);
  } catch (err: unknown) {
    const decodeError = err as DecodeError;
    if (decodeError.value) {
      errorMsg += `Invalid reviewDelayTolerance value: ${decodeError.value}\n`;
    }
  }
  try {
    config.timers.taskStaleTimeoutDuration = Value.Decode(stringDuration(), config.timers.taskStaleTimeoutDuration);
  } catch (err: unknown) {
    const decodeError = err as DecodeError;
    if (decodeError.value) {
      errorMsg += `Invalid taskStaleTimeoutDuration value: ${decodeError.value}\n`;
    }
  }
  try {
    config.timers.taskFollowUpDuration = Value.Decode(stringDuration(), config.timers.taskFollowUpDuration);
  } catch (err: unknown) {
    const decodeError = err as DecodeError;
    if (decodeError.value) {
      errorMsg += `Invalid taskFollowUpDuration value: ${decodeError.value}\n`;
    }
  }
  try {
    config.timers.taskDisqualifyDuration = Value.Decode(stringDuration(), config.timers.taskDisqualifyDuration);
  } catch (err: unknown) {
    const decodeError = err as DecodeError;
    if (decodeError.value) {
      errorMsg += `Invalid taskDisqualifyDuration value: ${decodeError.value}\n`;
    }
  }
  errorMsg += transformUseReferences(config);
  if (errorMsg) throw new Error(errorMsg);
}

function transformUseReferences(config: BotConfig) {
  let errorMsg = "";
  try {
    for (const plugins of Object.values(config.plugins)) {
      for (const plugin of plugins) {
        for (const use of plugin.uses) {
          // This case happens if the object was not transformed before, otherwise the value can be safely be ignored
          if (typeof use.plugin === "string") {
            use.plugin = Value.Decode(githubPluginType(), use.plugin);
          }
        }
      }
    }
  } catch (err: unknown) {
    const decodeError = err as DecodeError;
    if (decodeError.value) {
      errorMsg += `Invalid plugin use value: ${decodeError.value}\n`;
    }
  }
  return errorMsg;
}

/**
 * Parse a string from a yaml file and converts it to an object
 * @param data
 */
export function parseYaml(data: null | string) {
  try {
    if (data) {
      const parsedData = YAML.parse(data);
      return parsedData ?? null;
    }
  } catch (error) {
    console.error(`Failed to parse YAML: ${error}`);
    throw error;
  }
  return null;
}

interface DecodeError extends Error {
  value?: string;
}
