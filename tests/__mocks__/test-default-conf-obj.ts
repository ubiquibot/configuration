const defaultConfig = {
  plugins: {
    "issues.closed": [
      {
        skipBotEvents: true,
        uses: [
          {
            plugin: "ubiquibot/conversation-rewards@testing/ubiquibot-v2-testing",
            type: "github",
            with: {
              evmNetworkId: 100,
            },
          },
        ],
      },
    ],
  },
};

export default defaultConfig;
