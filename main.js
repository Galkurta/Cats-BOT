const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");

class CatsAPI {
  constructor() {
    this.baseURL = "https://api.catshouse.club";
    this.totalCats = 0;
  }

  headers(authorization) {
    return {
      accept: "*/*",
      "accept-language":
        "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      authorization: `tma ${authorization}`,
      "content-type": "application/json",
      origin: "https://cats-frontend.tgapps.store",
      referer: "https://cats-frontend.tgapps.store/",
      "sec-ch-ua":
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
    };
  }

  async createUser(authorization, referralCode) {
    const url = `${this.baseURL}/user/create?referral_code=${referralCode}`;
    const headers = this.headers(authorization);
    return axios.post(url, {}, { headers });
  }

  async getUserInfo(authorization) {
    const url = `${this.baseURL}/user`;
    const headers = this.headers(authorization);
    return axios.get(url, { headers });
  }

  async getTasks(authorization) {
    const url = `${this.baseURL}/tasks/user?group=cats`;
    const headers = this.headers(authorization);
    return axios.get(url, { headers });
  }

  async completeTask(authorization, taskId) {
    const url = `${this.baseURL}/tasks/${taskId}/complete`;
    const headers = this.headers(authorization);
    return axios.post(url, {}, { headers });
  }

  async completeTasks(authorization) {
    try {
      const tasksResponse = await this.getTasks(authorization);
      const allTasks = tasksResponse.data.tasks;
      console.log("Daily login: Done".green);
      console.log("Task:");
      for (const task of allTasks) {
        const status = task.completed ? "Done" : "Pending";
        console.log(`     ‣ ${task.title}: ${status}`.cyan);
        if (!task.completed) {
          try {
            await this.completeTask(authorization, task.id);
          } catch (error) {
            // Error handling remains the same
          }
        }
      }
      console.log("All available tasks completed".green);
    } catch (error) {
      console.log(`Error fetching tasks: ${error.message}`.red);
    }
  }

  async waitWithCountdown(seconds) {
    const startTime = Date.now();
    const endTime = startTime + seconds * 1000;

    return new Promise((resolve) => {
      const updateCountdown = () => {
        const now = Date.now();
        const remainingTime = Math.max(0, endTime - now);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(
          `Waiting ${hours.toString().padStart(2, "0")} Hour${
            hours !== 1 ? "s" : ""
          } ` +
            `${minutes.toString().padStart(2, "0")} Minute${
              minutes !== 1 ? "s" : ""
            } ` +
            `${secs.toString().padStart(2, "0")} Second${
              secs !== 1 ? "s" : ""
            } for next loop`
        );

        if (remainingTime > 0) {
          setTimeout(updateCountdown, 1000);
        } else {
          console.log("\n");
          resolve();
        }
      };

      updateCountdown();
    });
  }

  displaySummary() {
    console.log(
      `\nTotal $CATS all accounts: ${this.totalCats.toFixed(3)}`.green.bold
    );
  }

  async main() {
    const dataFile = "data.txt";
    const data = fs
      .readFileSync(dataFile, "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

    const referralCode = "inWAZ8WTRR25zmFBHLNtq";

    while (true) {
      this.totalCats = 0;
      for (let no = 0; no < data.length; no++) {
        const authorization = data[no];

        console.log(`\n[ Account ${no + 1} ]`.cyan.bold);

        try {
          await this.createUser(authorization, referralCode);
        } catch (error) {
          if (!error.response?.data?.message.includes("already exist")) {
            throw error;
          }
        }

        const userInfoResponse = await this.getUserInfo(authorization);
        const userInfo = userInfoResponse.data;
        console.log(`Name\t: ${userInfo.firstName}`.white);
        console.log(`Balance\t: ${userInfo.totalRewards}`.yellow);
        this.totalCats += parseFloat(userInfo.totalRewards);

        await this.completeTasks(authorization);
        console.log();
      }

      this.displaySummary();
      await this.waitWithCountdown(7 * 60 * 60); // 7 hours in seconds
    }
  }
}

if (require.main === module) {
  const catsAPI = new CatsAPI();
  catsAPI.main().catch((err) => {
    console.log(err.message.red);
    process.exit(1);
  });
}
