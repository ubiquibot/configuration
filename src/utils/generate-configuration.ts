import { Value } from "@sinclair/typebox/value";
import { DefinedError } from "ajv";
import mergeWith from "lodash/merge";
import YAML from "yaml";
import { BotConfig, stringDuration, validateBotConfig } from "../types";
// @ts-expect-error gets transformed by esbuild
import orgConfig from "../../.github/ubiquibot-config.yml";

export function generateConfiguration(repoConfig?: BotConfig): BotConfig {
  const merged = mergeWith({}, orgConfig, repoConfig, (objValue: unknown, srcValue: unknown) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      // if it's string array, concat and remove duplicates
      if (objValue.every((value) => typeof value === "string")) {
        return [...new Set(objValue.concat(srcValue))];
      }
      // otherwise just concat
      return objValue.concat(srcValue);
    }
  });

  const isValid = validateBotConfig(merged);
  if (!isValid) {
    const errorMessage = getErrorMsg(validateBotConfig.errors as DefinedError[]);
    if (errorMessage) {
      throw new Error(`Invalid merged configuration: ${errorMessage}`);
    }
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
  if (errorMsg) throw new Error(errorMsg);
}

function getErrorMsg(errors: DefinedError[]) {
  const errorsWithoutStrict = errors.filter((error) => error.keyword !== "additionalProperties");
  return errorsWithoutStrict.length === 0 ? null : errorsWithoutStrict.map((error) => error.instancePath.replaceAll("/", ".") + " " + error.message).join("\n");
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
