const validConfig = {
  "price-multiplier": 1.5,
  "command-settings": [
    {
      name: "start",
      enabled: false,
    },
  ],
  keys: {},
  features: {
    assistivePricing: false,
    defaultLabels: [],
    newContributorGreeting: {
      enabled: false,
      header: "Thank you for contributing! Please be sure to set your wallet address before completing your first task so that you can collect your reward.",
      displayHelpMenu: true,
      footer:
        "###### If you enjoy the DevPool experience, please follow [Ubiquity on GitHub](https://github.com/ubiquity) and star [this repo](https://github.com/ubiquity/devpool-directory) to show your support. It helps a lot!",
    },
    publicAccessControl: {
      setLabel: true,
      fundExternalClosedIssue: true,
    },
    isNftRewardEnabled: false,
  },
  timers: {
    reviewDelayTolerance: 86400000,
    taskStaleTimeoutDuration: 2419200000,
    taskFollowUpDuration: 302400000,
    taskDisqualifyDuration: 604800000,
  },
  payments: {
    maxPermitPrice: 9007199254740991,
    evmNetworkId: 1,
    basePriceMultiplier: 1,
    issueCreatorMultiplier: 1,
  },
  disabledCommands: ["start", "stop", "help", "query", "ask", "multiplier", "labels", "authorize", "wallet"],
  incentives: {
    enabled: true,
    contentEvaluator: {
      enabled: true,
    },
    userExtractor: {
      enabled: true,
      redeemTask: true,
    },
    dataPurge: {
      enabled: true,
    },
    formattingEvaluator: {
      enabled: true,
      scores: {
        br: 0,
        code: 1,
        p: 1,
        em: 0,
        img: 0,
        strong: 0,
        blockquote: 0,
        h1: 1,
        h2: 1,
        h3: 1,
        h4: 1,
        h5: 1,
        h6: 1,
        a: 1,
        li: 1,
        td: 1,
        hr: 0,
      },
      multipliers: [
        {
          type: ["ISSUE", "ISSUER", "SPECIFICATION"],
          formattingMultiplier: 1,
          wordValue: 0.1,
        },
        {
          type: ["ISSUE", "ISSUER", "COMMENTED"],
          formattingMultiplier: 1,
          wordValue: 0.2,
        },
        {
          type: ["ISSUE", "ASSIGNEE", "COMMENTED"],
          formattingMultiplier: 0,
          wordValue: 0,
        },
        {
          type: ["ISSUE", "COLLABORATOR", "COMMENTED"],
          formattingMultiplier: 1,
          wordValue: 0.1,
        },
        {
          type: ["ISSUE", "CONTRIBUTOR", "COMMENTED"],
          formattingMultiplier: 0.25,
          wordValue: 0.1,
        },
        {
          type: ["REVIEW", "ISSUER", "TASK"],
          formattingMultiplier: 0,
          wordValue: 0,
        },
        {
          type: ["REVIEW", "ISSUER", "COMMENTED"],
          formattingMultiplier: 2,
          wordValue: 0.2,
        },
        {
          type: ["REVIEW", "ASSIGNEE", "COMMENTED"],
          formattingMultiplier: 1,
          wordValue: 0.1,
        },
        {
          type: ["REVIEW", "COLLABORATOR", "COMMENTED"],
          formattingMultiplier: 1,
          wordValue: 0.1,
        },
        {
          type: ["REVIEW", "CONTRIBUTOR", "COMMENTED"],
          formattingMultiplier: 0.25,
          wordValue: 0.1,
        },
      ],
    },
    permitGeneration: {
      enabled: true,
    },
    githubComment: {
      enabled: true,
      post: true,
      debug: false,
    },
  },
  labels: {
    time: ["Time: <1 Hour", "Time: <2 Hours", "Time: <4 Hours", "Time: <1 Day", "Time: <1 Week"],
    priority: ["Priority: 1 (Normal)", "Priority: 2 (Medium)", "Priority: 3 (High)", "Priority: 4 (Urgent)", "Priority: 5 (Emergency)"],
  },
  miscellaneous: {
    maxConcurrentTasks: 9007199254740991,
    promotionComment:
      "###### If you enjoy the DevPool experience, please follow [Ubiquity on GitHub](https://github.com/ubiquity) and star [this repo](https://github.com/ubiquity/devpool-directory) to show your support. It helps a lot!",
    registerWalletWithVerification: false,
    openAiTokenLimit: 100000,
  },
};

export default validConfig;
