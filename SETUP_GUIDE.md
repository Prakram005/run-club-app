# Run Club - Setup Guide

## 🗺️ Google Maps API Key Setup

The Map section requires a Google Maps API key to display the interactive map with event locations and live tracking.

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select **"New Project"**
3. Enter project name: `Run Club App`
4. Click **Create**

### Step 2: Enable Maps API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API** (for address-to-location conversion)
   - ✅ **Places API** (optional, for location suggestions)

### Step 3: Create an API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **API Key**
3. Copy the generated API key

### Step 4: Add API Key to Project
1. Navigate to your project root directory
2. Create or open `.env.local` file
3. Add the following line:
   ```env
   VITE_GOOGLE_MAPS_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual API key

4. Save the file

### Step 5: Restart Development Server
```bash
npm run dev
```

## 🎨 App Features

### ✨ Live Animations
- Splash screen with animated Run Club branding
- Floating particles background
- Glowing text effects
- Engaging button interactions
- Smooth page transitions

### 🗺️ Map Features
- **Live Tracking**: See all upcoming events on the map
- **Event Markers**: Colorful markers with pulsing animations
- **User Location**: Locate yourself with one click
- **Event Details**: Click markers to view event information
- **Map Controls**: Toggle animations, heatmap, sound

### 🎬 AI Video Player
- AI-generated workout videos
- Expandable/collapsible player
- Video recommendations

###🏆 Leaderboard
- Real-time rankings with animations
- Streak tracking with flame icons
- Medal badges for top runners

### 🔴 Live Features
- Real-time notifications
- Participant tracking
- Activity feeds
- Live event status

## 🚀 Deployment

### Vercel Deployment
If you're deploying to Vercel, add the environment variable in:
1. Project Settings > Environment Variables
2. Add: `VITE_GOOGLE_MAPS_KEY` with your API key value

## 📱 Troubleshooting

### Map Not Loading?
1. ✅ Check if `VITE_GOOGLE_MAPS_KEY` is set in `.env.local`
2. ✅ Verify the API key is valid in Google Cloud Console
3. ✅ Ensure Maps JavaScript API is enabled
4. ✅ Check browser console for errors
5. ✅ Restart development server: `npm run dev`

### Animations Not Working?
- Make sure Framer Motion is installed: `npm install framer-motion`
- Check browser console for JavaScript errors

### Videos Not Playing?
- AI Video Player is a demo component
- To integrate real videos, connect to:
  - YouTube API
  - Vimeo
  - Custom video hosting
  - AI services (D-ID, Synthesia)

## 📚 Technologies Used

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Google Maps API
- **Real-time**: Socket.io
- **Routing**: React Router
- **State Management**: Context API
- **Build Tool**: Vite

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 💡 Tips & Best Practices

1. **Google Maps API Cost**: 
   - Set billing alerts to avoid unexpected charges
   - Consider using [Restricted API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)

2. **Environment Variables**:
   - Never commit `.env.local` to git
   - Use `.env.local` for local development
   - Use Vercel environment variables for production

3. **Performance**:
   - Enable map clustering for many markers
   - Lazy load the Maps JavaScript API
   - Cache marker data

4. **User Experience**:
   - Show loading states while maps load
   - Provide helpful error messages
   - Enable location sharing in browser settings

---

**Version**: 1.0.0  
**Last Updated**: April 18, 2026
