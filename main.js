const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");

class CatsAPI {
  constructor() {
    this.baseURL = "https://cats-backend-wkejfn-production.up.railway.app";
    this.totalBalance = 0;
  }

  headers(authorization) {
    return {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
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

  log(msg, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    switch (type) {
      case "success":
        console.log(`${timestamp} ${msg}`.green);
        break;
      case "error":
        console.log(`${timestamp} ${msg}`.red);
        break;
      case "warning":
        console.log(`${timestamp} ${msg}`.yellow);
        break;
      default:
        console.log(`${timestamp} ${msg}`.blue);
    }
  }

  async waitWithCountdown(hours) {
    const totalSeconds = hours * 3600;
    for (let i = totalSeconds; i >= 0; i--) {
      const hours = Math.floor(i / 3600);
      const minutes = Math.floor((i % 3600) / 60);
      const seconds = i % 60;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(
        `Completed all accounts. Next run in: ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("");
  }

  async completeTasks(authorization) {
    try {
      const tasksResponse = await this.getTasks(authorization);
      const incompleteTasks = tasksResponse.data.tasks.filter(
        (task) => !task.completed
      );

      for (const task of incompleteTasks) {
        try {
          await this.completeTask(authorization, task.id);
        } catch (error) {
          // Error handling for task completion (silent)
        }
      }
      this.log(`Completed all tasks`, "success");
    } catch (error) {
      this.log(`Error fetching task list: ${error.message}`, "error");
    }
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
      this.totalBalance = 0;
      for (let accountIndex = 0; accountIndex < data.length; accountIndex++) {
        const authorization = data[accountIndex];

        try {
          await this.createUser(authorization, referralCode);
        } catch (error) {
          // Silently handle user creation errors
        }

        const userInfoResponse = await this.getUserInfo(authorization);
        const userInfo = userInfoResponse.data;
        console.log(
          `Account ${accountIndex + 1} | ${userInfo.firstName}`.green
        );
        this.log(`Balance: ${userInfo.totalRewards}`);
        this.totalBalance += parseInt(userInfo.totalRewards);

        await this.completeTasks(authorization);
      }

      this.log(`Total Balance: ${this.totalBalance}`, "success");
      await this.waitWithCountdown(6); // Wait for 6 hours
    }
  }
}

if (require.main === module) {
  const catsAPI = new CatsAPI();
  catsAPI.main().catch((err) => {
    catsAPI.log(err.message, "error");
    process.exit(1);
  });
}
