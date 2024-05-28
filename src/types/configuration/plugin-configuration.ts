import { Type as T } from "@sinclair/typebox";
import { StaticDecode } from "@sinclair/typebox";
import { githubWebhookEvents } from "./webhook-events";

const pluginNameRegex = new RegExp("^([0-9a-zA-Z-._]+)\\/([0-9a-zA-Z-._]+)(?::([0-9a-zA-Z-._]+))?(?:@([0-9a-zA-Z-._]+(?:\\/[0-9a-zA-Z-._]+)?))?$");

type GithubPlugin = {
  type: "github";
  owner: string;
  repo: string;
  workflowId: string;
  ref?: string;
};

type HttpsPlugin = {
  type: "https";
  url: string;
};

export type Plugin = GithubPlugin | HttpsPlugin;

function githubPluginType() {
  return T.Transform(T.String())
    .Decode((value) => {
      if (value.startsWith("https://")) {
        return {
          type: "https",
          url: value,
        } as Plugin;
      }
      const matches = value.match(pluginNameRegex);
      if (!matches) {
        throw new Error(`Invalid plugin name: ${value}`);
      }
      return {
        type: "github",
        owner: matches[1],
        repo: matches[2],
        workflowId: matches[3] || "compute.yml",
        ref: matches[4] || undefined,
      } as Plugin;
    })
    .Encode((value) => {
      if (value.type === "github") {
        return `${value.owner}/${value.repo}${value.workflowId ? ":" + value.workflowId : ""}${value.ref ? "@" + value.ref : ""}`;
      } else if (value.type === "https") {
        return value.url;
      } else {
        throw new Error(`Invalid plugin type`);
      }
    });
}

const pluginChainSchema = T.Array(
  T.Object({
    id: T.Optional(T.String()),
    plugin: githubPluginType(),
    with: T.Record(T.String(), T.Unknown()),
  }),
  { minItems: 1 }
);

export type PluginChain = StaticDecode<typeof pluginChainSchema>;

const handlerSchema = T.Array(
  T.Object({
    name: T.Optional(T.String()),
    description: T.Optional(T.String()),
    command: T.Optional(T.String()),
    example: T.Optional(T.String()),
    uses: pluginChainSchema,
    skipBotEvents: T.Boolean({ default: true }),
  }),
  { default: [] }
);

export const pluginConfigurationSchema = T.Record(T.Enum(githubWebhookEvents), handlerSchema, { default: {} });

export type PluginConfiguration = StaticDecode<typeof pluginConfigurationSchema>;
