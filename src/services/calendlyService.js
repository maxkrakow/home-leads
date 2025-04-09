// This file handles Calendly API interactions

const CALENDLY_API_URL = 'https://api.calendly.com';
const CLIENT_ID = 'NduAR5y-GwU7_twUNp-UPac9Ia6i7glyL0g1ZRYfVwY';
const CLIENT_SECRET = 'iFdVbDL4wZapXdOKJfvN0ENCF2I7fmZWjdc4YRJCExM';
const WEBHOOK_SIGNING_KEY = 'CBs2vTzkwtxKhBLVtflHt_rVZXs4n8mNV_TBtaXU2kA';
const REDIRECT_URI = 'https://untapped-homes.vercel.app/calendly-auth-callback';

// Store tokens in localStorage
const saveTokens = (tokens) => {
  localStorage.setItem('calendlyTokens', JSON.stringify(tokens));
};

// Get tokens from localStorage
const getTokens = () => {
  const tokens = localStorage.getItem('calendlyTokens');
  return tokens ? JSON.parse(tokens) : null;
};

// Exchange authorization code for access token
const getAccessToken = async (code) => {
  try {
    const response = await fetch(`${CALENDLY_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    saveTokens(data);
    return data;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Refresh the access token
const refreshToken = async () => {
  const tokens = getTokens();
  if (!tokens || !tokens.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${CALENDLY_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const data = await response.json();
    saveTokens({
      ...tokens,
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Get user information
const getUserInfo = async () => {
  let tokens = getTokens();
  if (!tokens) {
    throw new Error('Not authenticated with Calendly');
  }

  try {
    const response = await fetch(`${CALENDLY_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await refreshToken();
      tokens = getTokens();
      
      // Retry with new token
      const retryResponse = await fetch(`${CALENDLY_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      
      if (!retryResponse.ok) {
        throw new Error(`Failed to get user info: ${retryResponse.status}`);
      }
      
      return await retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

// Get user's event types
const getEventTypes = async () => {
  let tokens = getTokens();
  if (!tokens) {
    throw new Error('Not authenticated with Calendly');
  }

  // First get the user to get their URI
  const userInfo = await getUserInfo();
  const userUri = userInfo.resource.uri;

  try {
    const response = await fetch(`${CALENDLY_API_URL}/event_types?user=${userUri}`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await refreshToken();
      tokens = getTokens();
      
      // Retry with new token
      const retryResponse = await fetch(`${CALENDLY_API_URL}/event_types?user=${userUri}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      
      if (!retryResponse.ok) {
        throw new Error(`Failed to get event types: ${retryResponse.status}`);
      }
      
      return await retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Failed to get event types: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting event types:', error);
    throw error;
  }
};

// Generate authorization URL
const getAuthorizationUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'default'
  });
  
  return `${CALENDLY_API_URL}/oauth/authorize?${params.toString()}`;
};

// Logout - clear tokens
const logout = () => {
  localStorage.removeItem('calendlyTokens');
};

// Verify webhook signature
const verifyWebhookSignature = (signature, timestamp, body) => {
  // This would typically be done on the server side
  // For client-side, you'd need to send these values to your backend
  console.log('Webhook verification would happen here with key:', WEBHOOK_SIGNING_KEY);
  return true; // Placeholder
};

export default {
  getAccessToken,
  refreshToken,
  getUserInfo,
  getEventTypes,
  getAuthorizationUrl,
  getTokens,
  logout,
  verifyWebhookSignature,
}; 