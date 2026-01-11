# Deployment Guide

This guide explains how to deploy your **Neon Tic Tac Toe** game to **Render.com** (a free hosting platform for Node.js apps).

## Prerequisites
- A GitHub account.
- The project code pushed to a GitHub repository.

## Steps

1.  **Prepare your code**
    - Ensure your project files (`index.html`, `style.css`, `script.js`, `server.js`, `package.json`) are ready.

2.  **Deploy on Render**
    - Go to [render.com](https://render.com) and sign up/login.
    - Click **"New +"** -> **"Web Service"**.
    - Connect your Git provider/account (e.g. GitLab, BitBucket, or others).
    - Select the repository.
    - **Settings**:
        - **Name**: `neon-tic-tac-toe` (or unique name).
        - **Region**: Choose the one closest to you.
        - **Branch**: `main` (or master).
        - **Root Directory**: `Tic tac toe game` (Important: Type this exactly so Render finds your files).
        - **Runtime**: `Node`.
        - **Build Command**: `npm install`
        - **Start Command**: `npm start` (Important: Replace `yarn start` with `npm start`)
        - **Environment Variables**: You can leave this section **empty**. We don't need any special variables for this game.
    - Click **"Create Web Service"**.

5.  **Deploy**
    - Click **"Create Web Service"**.
    - Render will start building your app. This might take a few minutes.
    - Once finished, you will see a green "Live" badge and a URL (e.g., `https://neon-tic-tac-toe.onrender.com`).

6.  **Play!**
    - Share the URL with a friend.
    - Both of you open the link, click "Play Online", and you will be connected!
