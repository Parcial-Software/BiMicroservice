module.exports = {
    apps: [
      {
        name: "backend",
        script: "index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "queue",
        script: "queue.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  