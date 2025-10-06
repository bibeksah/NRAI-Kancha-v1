# Azure AD App Registration - Add AI Services Permission

## Error Explained
Your Azure AD app (NepalReforms) is trying to request access to `https://ai.azure.com`, but this permission hasn't been added to your app registration yet.

## Fix: Add Azure AI Services API Permission

### Step 1: Go to Azure Portal
1. Open https://portal.azure.com
2. Sign in with your Azure account

### Step 2: Navigate to App Registrations
1. In the search bar at the top, type **"App registrations"**
2. Click on "App registrations" from the results
3. Find and click on your app: **NepalReforms** (ID: 37906225-2b07-402e-ac74-1c16242084d9)

### Step 3: Add API Permission
1. In the left sidebar, click **"API permissions"**
2. Click the **"+ Add a permission"** button
3. In the "Request API permissions" panel:
   - Click on **"APIs my organization uses"** tab
   - In the search box, type: **"Azure AI Services"** or **"Cognitive Services"**
   - Look for one of these:
     - **Azure AI Services** (Recommended)
     - **Azure Cognitive Services**
   - Click on it

4. Select permission type:
   - Click **"Delegated permissions"**
   - Check the box for **"user_impersonation"** or **".default"**
   - Click **"Add permissions"** button at the bottom

### Step 4: Grant Admin Consent
1. After adding the permission, you'll see it in the list
2. Click the **"Grant admin consent for [Your Organization]"** button
3. Click **"Yes"** to confirm

### Step 5: Verify the Permission
You should now see:
- **API / Permissions name**: Azure AI Services / user_impersonation
- **Type**: Delegated
- **Status**: ✅ Granted for [Your Organization]

## Alternative: Add by Application ID

If you can't find "Azure AI Services" in the search:

1. Click **"+ Add a permission"**
2. Click **"APIs my organization uses"**
3. Click on the **"Application ID"** tab at the top
4. Enter this Application ID: `18a66f5f-dbdf-4c17-9dd7-1634712a9cbe`
5. Click the result that appears
6. Select **"Delegated permissions"**
7. Check **"user_impersonation"**
8. Click **"Add permissions"**
9. Click **"Grant admin consent"**

## What This Permission Does

This grants your application permission to:
- Access Azure AI Services on behalf of the signed-in user
- Create and manage AI agents
- Access Azure AI Foundry resources

## After Adding the Permission

### Clear Your Browser Session
Since you have an old token without the new permissions:

**Option A: Use Incognito Window**
Just test in a new incognito/private browser window

**Option B: Clear Session Storage**
1. Press F12 in your browser
2. Go to "Application" → "Session Storage"  
3. Delete these keys:
   - `azure_access_token`
   - `oauth_state`

### Test Again
1. Restart your dev server: `pnpm run dev`
2. Go to http://localhost:3000/login
3. Click "Login with Azure"
4. Sign in again
5. You should now get a token with the correct permissions!

## Expected Success

After adding the permission and logging in again, you should see:
```
[v0] Thread created successfully
[v0] Thread ID: thread_abc123...
```

## Screenshots Guide

### Adding Permission:
```
Azure Portal
→ App registrations
→ NepalReforms
→ API permissions
→ + Add a permission
→ APIs my organization uses
→ Search: "Azure AI Services"
→ Delegated permissions
→ ✓ user_impersonation
→ Add permissions
→ Grant admin consent
```

## Troubleshooting

### Can't Find "Azure AI Services"?
- Try searching for "Cognitive Services" instead
- Or use the Application ID method above
- Make sure you're looking in "APIs my organization uses" tab

### Don't Have Admin Rights?
- You need to be an admin or have the "Application Administrator" role
- Contact your Azure AD administrator to grant the permission
- Or have them give you the required role

### Still Getting Errors After Adding Permission?
- Make sure you clicked "Grant admin consent"
- Wait 1-2 minutes for the permission to propagate
- Clear your browser session storage completely
- Try in an incognito window
- Make sure the permission shows "Status: Granted"

## Current App Configuration

Your app details:
- **App Name**: NepalReforms  
- **Client ID**: 37906225-2b07-402e-ac74-1c16242084d9
- **Tenant ID**: b58814b6-50ee-4d3d-97e5-fe8167a51c1f

## Next Steps

1. ✅ Add Azure AI Services API permission (follow steps above)
2. ✅ Grant admin consent
3. ✅ Clear browser session storage
4. ✅ Login again with Azure
5. ✅ Test the chatbot

Let me know once you've added the permission and I'll help you test!
