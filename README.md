# Daily Net

A mobile application for tracking daily mood, nutrition, financial transactions, and health data.

## Features

- **Authentication**: Google and Apple sign-in only
- **Multi-language**: Turkish and English support
- **Dark Mode**: Light and dark theme support
- **Cloud Sync**: All data synced across devices
- **Mood Tracking**: Log mood with emoji scale (1-10)
- **Nutrition Tracking**: Track meals with automatic nutrition calculation
- **Financial Tracking**: Log income and expenses with categories
- **Health Integration**: Sync with Apple Health/Google Health
- **Analytics**: View trends and export reports (premium)

## Tech Stack

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type safety
- **Supabase** - Backend and authentication
- **i18next** - Internationalization
- **React Navigation** - Navigation

## Setup

### Prerequisites

- Node.js 16+
- React Native development environment
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase and Google credentials

4. For iOS:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

5. For Android:
   ```bash
   npm run android
   ```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the migration files in `supabase/migrations/`
3. Configure authentication providers (Google, Apple)
4. Update `.env` with your Supabase URL and keys

### Google Sign-In Setup

1. Create a Google Cloud project
2. Enable Google Sign-In API
3. Create OAuth 2.0 credentials
4. Add your web client ID to `.env`

### Apple Sign-In Setup

1. Enable Sign in with Apple in your Apple Developer account
2. Configure your app's bundle identifier
3. No additional configuration needed in the app

## Project Structure

```
src/
├── contexts/          # React contexts (Auth, Theme, Language, Database)
├── screens/           # Screen components
├── services/          # External services (Supabase, i18n)
├── components/        # Reusable components (to be added)
├── types/            # TypeScript type definitions (to be added)
└── utils/            # Utility functions (to be added)
```

## Development Status

### Phase 1: Foundation & Authentication ✅
- [x] React Native project setup
- [x] Multi-language support (TR/EN)
- [x] Google & Apple authentication
- [x] Cloud data storage with Supabase
- [x] Theme system (light/dark mode)

### Phase 2: Core Tracking Features (In Progress)
- [ ] Mood tracking with emoji scale
- [ ] Nutrition tracking with food database
- [ ] Financial tracking with categories
- [ ] Health data integration

### Phase 3: Advanced Features (Planned)
- [ ] Push notifications and reminders
- [ ] Analytics dashboard
- [ ] Data export (CSV/PDF)
- [ ] Premium subscription

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Test on both iOS and Android
4. Update documentation as needed

## License

Private project - All rights reserved