const defaultConfig = {
  "price-multiplier": 1.5,
  "command-settings": [
    {
      name: "start",
      enabled: false,
    },
  ],
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
          type: ["ISSUE", "ISSUER", "TASK"],
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
          type: ["REVIEW", "ISSUER", "SPECIFICATION"],
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
};

export default defaultConfig;
