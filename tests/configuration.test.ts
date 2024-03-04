import * as fs from "fs";
import path from "node:path";
import { BotConfig, generateConfiguration, parseYaml, transformConfig } from "../src";
import validConfig from "./__mocks__/test-valid-conf-obj";

const filePath = path.join(__dirname, "./__mocks__/test-valid-config.yml");

describe("Configuration generation", () => {
  test("Parse Yaml file", () => {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    const parsed = parseYaml(fileContent);
    // Silences the error output since it is expected to have errors logged
    const spy = jest.spyOn(console, "error").mockImplementation(jest.fn());
    expect(() => parseYaml("$@-test-123\\\ntest -: test")).toThrow();
    spy.mockClear();
    const parseEmpty = parseYaml(null);
    expect(parseEmpty).toBeNull();
    expect(parsed).toStrictEqual({
      "price-multiplier": 1.5,
      "command-settings": [{ name: "start", enabled: false }],
    });
  });

  test("Generate configuration", async () => {
    const cfg = generateConfiguration();
    expect(cfg).toStrictEqual(validConfig);
    expect(() => {
      generateConfiguration({ keys: ["123"] } as unknown as BotConfig);
    }).toThrow();
  });

  test("Transform configuration", async () => {
    const cfg = generateConfiguration();
    expect(() => {
      transformConfig(cfg);
    }).toThrow();
    const stringCfg = {
      ...cfg,
      timers: {
        reviewDelayTolerance: "86400000",
        taskStaleTimeoutDuration: "2419200000",
        taskFollowUpDuration: "302400000",
        taskDisqualifyDuration: "604800000",
      },
    } as unknown as BotConfig;
    transformConfig(stringCfg);
    expect(stringCfg).toStrictEqual(validConfig);
  });
});
