# Azure AI Chatbot with Voice Capabilities

A comprehensive AI chatbot that connects to Azure AI Foundry-deployed agents with full voice capabilities supporting both Nepali and English languages.

## Features

- ✅ **Azure AI Foundry Integration**: Secure connection with hybrid authentication (API key or Azure Identity)
- ✅ **Bilingual Support**: Seamless switching between English and Nepali
- ✅ **Voice Input (STT)**: Speech-to-text using Azure Speech Services
- ✅ **Voice Output (TTS)**: Text-to-speech with auto-speak functionality
- ✅ **Iframe Embeddable**: Easy integration into any website
- ✅ **Modern UI**: Dark theme with professional design
- ✅ **Responsive**: Works on all device sizes

## Setup Instructions

### 1. Azure AD App Registration (For OAuth Login)

If you want to use interactive Azure login (like 'az login' in the browser), you need to configure an Azure AD app:

#### Step 1: Create or Configure Azure AD App

1. Go to [Azure Portal → App Registrations](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps)
2. Find your existing app or click "New registration"
3. Note your **Application (client) ID** and **Directory (tenant) ID**

#### Step 2: Configure Redirect URI

1. In your app registration, click "Authentication" in the left menu
2. Under "Platform configurations", click "Add a platform"
3. Select "Web"
4. Add your Redirect URI:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`
   - For v0 preview: `https://your-v0-preview-url.vercel.app/auth/callback`
5. Click "Configure" and then "Save"

#### Step 3: Create Client Secret

1. In your app registration, click "Certificates & secrets"
2. Click "New client secret"
3. Add a description and choose expiration
4. Copy the **Value** (this is your `AZURE_CLIENT_SECRET`)

#### Step 4: Configure API Permissions

1. In your app registration, click "API permissions"
2. Click "Add a permission"
3. Select "Azure Service Management" or "Cognitive Services"
4. Add the following permissions:
   - `https://cognitiveservices.azure.com/.default`
   - `openid`
   - `profile`
   - `email`
5. Click "Grant admin consent" if required

### 2. Azure AI Foundry Setup

#### Find Your Project URL and Agent ID

1. Go to [Azure AI Foundry](https://ai.azure.com/)
2. Open your project
3. **Project URL**: Click on "Overview" → Copy the "Project connection string" or "Endpoint URL"
   - Format: `https://your-project.services.ai.azure.com/api/projects/your-project`
4. **Agent ID**: Go to "Agents" → Select your agent → Copy the "Agent ID"
   - Format: `asst_xxxxxxxxxxxxx`

#### Get API Key (Optional - for Development)

1. In your Azure AI Foundry project, go to "Settings" → "Keys and Endpoint"
2. Copy "Key 1" or "Key 2"
3. This is your `AZURE_AI_API_KEY`

### 3. Azure Speech Services Setup

#### Find Your Speech Key and Region

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to your Speech Services resource (or create one)
3. Go to "Keys and Endpoint"
4. **Speech Key**: Copy "KEY 1" or "KEY 2"
5. **Region**: Copy the "Location/Region" (e.g., `eastus`, `westeurope`)

### 4. Environment Variables

Add these environment variables in **Project Settings → Environment Variables** in v0:

**Required for all setups:**
\`\`\`bash
AZURE_AI_PROJECT_URL=https://your-project.services.ai.azure.com/api/projects/your-project
AZURE_AI_AGENT_ID=asst_your_agent_id
SPEECH_KEY=your_speech_key
SPEECH_REGION=your_region
\`\`\`

**For OAuth Authentication (Interactive Login):**
\`\`\`bash
NEXT_PUBLIC_AZURE_CLIENT_ID=37906225-2b07-402e-ac74-1c16242084d9
NEXT_PUBLIC_AZURE_TENANT_ID=b58814b6-50ee-4d3d-97e5-fe8167a51c1f
AZURE_CLIENT_SECRET=your_client_secret
\`\`\`

**OR for API Key Authentication (Simpler):**
\`\`\`bash
AZURE_AI_API_KEY=your_azure_ai_api_key
\`\`\`

### 5. Authentication Options

#### Option 1: API Key (Recommended for Development)
Set `AZURE_AI_API_KEY` in environment variables. This is the simplest method for development and preview environments.

#### Option 2: Azure Identity (Production)
For production deployments without API keys:

**Local Development:**
\`\`\`bash
az login
\`\`\`

**Production (Vercel/Azure):**
Use Managed Identity or Service Principal:
\`\`\`bash
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_TENANT_ID=your_tenant_id
\`\`\`

### 6. Install and Run

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the chatbot.

## Embedding the Chatbot

To embed the chatbot in your website:

\`\`\`html
<iframe 
    src="https://your-domain.com/embed" 
    width="100%" 
    height="600px"
    style="border: none; border-radius: 12px;"
    title="AI Chatbot"
    allow="microphone"
></iframe>
\`\`\`

See `/public/embed.html` for a complete example.

## Language Support

### English
- Voice: en-US-AvaMultilingualNeural
- Recognition: en-US

### Nepali
- Voice: ne-NP-HemkalaNeural
- Recognition: ne-NP

## Architecture

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4 with dark theme
- **Azure Integration**: @azure/ai-projects with hybrid authentication
- **Speech**: microsoft-cognitiveservices-speech-sdk with token-based auth
- **API Routes**: Server-side Azure agent communication (Node.js runtime)

## Security

- Speech tokens generated server-side (10-minute expiry)
- Azure Identity or API key authentication
- Server-side agent communication
- No sensitive keys exposed to client
- Secure credential management

## Browser Permissions

The chatbot requires microphone permission for voice input. Users will be prompted when they first use the voice feature.

## Troubleshooting

### "DefaultAzureCredential is not supported in the browser"
- Make sure you've set `AZURE_AI_API_KEY` in environment variables
- Or ensure you're logged in with `az login` for local development

### "Failed to get speech token"
- Verify `SPEECH_KEY` and `SPEECH_REGION` are set correctly
- Check that your Speech Services resource is active in Azure Portal

### "Missing required environment variables"
- Go to Project Settings (gear icon) → Environment Variables
- Add all required variables listed in section 4 above

### "The redirect URI specified in the request does not match"
This means you need to add the redirect URI to your Azure AD app registration:
1. Go to Azure Portal → App Registrations → Your App
2. Click "Authentication"
3. Add the redirect URI shown on the login page
4. Save and try again

The redirect URI format is: `https://your-domain.com/auth/callback`
