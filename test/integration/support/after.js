const { spawn } = require("child_process");

const stopPrivacyDocker = () => {
  return new Promise((resolve) => {
    const run = spawn("cd docker && ./stop.sh && ./remove.sh", {
      shell: true,
      stdio: "inherit",
    });

    run.on("close", () => {
      return resolve({});
    });
  });
};

stopPrivacyDocker().catch(console.error);
