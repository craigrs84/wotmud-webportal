# WoTMUD Web Portal - Early Beta

A web-based client for WoTMUD that allows you to play from any browser without installing software on your gaming device.

## Overview

This early beta webclient allows you to host a WoTMUD portal on your home network and access it from anywhere. The host computer requires some setup, but once configured, you can play from any browser on any device.

## Requirements

- A computer that stays powered on 24/7 and is connected to your home network
  - A Raspberry Pi is ideal for this purpose
  - A regular Windows machine works fine for testing/getting started
- Node.js installed on the host computer
- Cloudflare Tunnel (cloudflared) for secure external access

## Installation

### Step 1: Install Node.js

Download and install Node.js from the official website:
https://nodejs.org/en/download

### Step 2: Download the Web Portal

Download and extract the latest version:
https://github.com/craigrs84/wotmud-webportal/archive/refs/heads/main.zip

### Step 3: Set Up the Web Server

1. Open a command prompt/terminal
2. Navigate to the directory where you extracted the ZIP file
3. Run the following commands:
```bash
   npm install
   npm start
```
4. **Keep this window open** - closing it will stop the server

### Step 4: Set Up Cloudflare Tunnel

1. Open a **second** command prompt/terminal
2. Install Cloudflare Tunnel:
```bash
   winget install --id Cloudflare.cloudflared
```
3. Start the tunnel:
```bash
   cloudflared tunnel --url http://localhost:8080/
```
4. **Keep this window open** - closing it will stop the tunnel

## Usage

Once both windows are running:

1. The Cloudflare tunnel (Step 4) will provide you with a URL
2. Click or copy/paste this URL into any web browser
3. You can now access WoTMUD from:
   - Any computer on your home network
   - Any external computer (e.g., work computer, mobile device)
4. **No software installation required** on client devices

## Notes

- This is an early beta release
- The webclient is not officially hosted - you're responsible for running your own instance
- Keep both command prompt windows open while you want the portal to be accessible
- The Cloudflare tunnel URL may change each time you restart the tunnel

## Support

For issues or questions, please visit:
https://github.com/craigrs84/wotmud-webportal

---

*Note: This project is not affiliated with or endorsed by WoTMUD's official maintainers.*
