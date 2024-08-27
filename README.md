# Cats-BOT Automation Script

## Overview

This Node.js script automates interactions with the CatsAPI, a platform for managing cat-related tasks and rewards. It handles user creation, task completion, and balance tracking for multiple accounts.

## Features

- Automatic user registration
- Task completion automation
- Balance tracking for individual accounts
- Total balance calculation across all accounts
- Periodic execution with a configurable interval

## Prerequisites

- Node.js (v12.0.0 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Install the required dependencies:

```bash
npm install
```

## Configuration

1. Edit `data.txt`.
2. Add authorization tokens for each account, one per line.

## Usage

Run the script using Node.js:

```bash
node main.js
```

The script will:

1. Process each account in `data.txt`
2. Create users if necessary
3. Complete available tasks
4. Display individual and total balances
5. Wait for 6 hours before the next cycle

## Registration

To register a new account, use the following link:

[Register for Cats](https://t.me/catsgang_bot/join?startapp=inWAZ8WTRR25zmFBHLNtq)

After registration, add your authorization token to the `data.txt` file.

## Important Notes

- This script is designed to run continuously. Use Ctrl+C to stop execution.
- Ensure you comply with the CatsAPI terms of service when using this automation script.
- The script includes error handling, but monitor its execution for any unexpected behavior.

## Disclaimer

This script is provided for educational purposes only. Use it responsibly and in accordance with the CatsAPI's terms of service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
