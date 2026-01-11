# Deploying Emoji Tic-Tac-Toe Arena

This guide explains how to deploy the Emoji Tic-Tac-Toe Arena to Firebase App Hosting.

## Prerequisites

- A Firebase project (you already have one configured: `emoji-tic-tac-toe-arena`).
- A GitHub account.
- The code pushed to a GitHub repository.

## Deployment Steps

1.  **Push Code to GitHub**:
    Ensure your latest changes (including the new `manifest.json` and updated `layout.tsx`) are committed and pushed to your GitHub repository.

2.  **Go to Firebase Console**:
    Visit the [Firebase Console](https://console.firebase.google.com/) and select your project `emoji-tic-tac-toe-arena`.

3.  **Navigate to App Hosting**:
    In the left sidebar, look for "Build" and then select "App Hosting".

4.  **Get Started**:
    Click on "Get started" if this is your first time, or "Create backend".

5.  **Connect to GitHub**:
    - Follow the prompts to connect your GitHub account.
    - Select the repository containing this project.
    - Select the branch you want to deploy (usually `main` or `master`).

6.  **Configure Deployment Settings**:
    - **Root Directory**: Leave this blank if your `package.json` is in the root. If it's in a subdirectory, specify it here.
    - **Live Preview**: You can enable this to deploy pull requests automatically.

7.  **Deploy**:
    Click "Create and deploy". Firebase App Hosting will detect that this is a Next.js app and automatically configure the build and start commands.

## Environment Variables

If you need to set environment variables (e.g., for API keys), you can do so in the "Settings" tab of your App Hosting backend in the Firebase Console.

## Troubleshooting

- **Build Fails**: Check the logs in the Firebase Console. Ensure `npm run build` works locally.
- **Runtime Errors**: Check the logs in the Cloud Run console (linked from App Hosting).
