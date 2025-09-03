# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Using AI Features

This application uses the Gemini API to power its AI features. To enable them, you'll need to provide your own API key.

### Local Development

1.  Get an API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2.  Open the `.env` file in the project.
3.  Add the following line, replacing `"YOUR_API_KEY"` with the key you just created:
    ```
    GEMINI_API_KEY="YOUR_API_KEY"
    ```

### Vercel Deployment

When deploying to Vercel, you need to set your environment variables in the project settings for the AI features to work.

1.  In your Vercel project dashboard, go to **Settings > Environment Variables**.
2.  Add a new variable with the key `GEMINI_API_KEY`.
3.  Paste your API key into the value field.
4.  Save the changes. You may need to redeploy your project for the changes to take effect.

Your app's AI features should now be enabled on your Vercel deployment.
