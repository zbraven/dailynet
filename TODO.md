# Daily Net — TODO Checklist

## Phase 1: Foundation & Authentication
- [x] Initialize React Native Project
  - **Acceptance Criteria**: Project builds and runs on iOS & Android simulators.

- [x] Set Up Multilanguage Support (TR/EN)
  - **Acceptance Criteria**: All static UI text can be toggled between Turkish and English.

- [x] Implement Google & Apple Login (No Anonymous)
  - **Acceptance Criteria**:
    - Only Google or Apple sign-in is available.
    - Users cannot access app without signing in.
    - Authentication tokens are securely stored.

- [x] Cloud Data Storage Setup
  - **Acceptance Criteria**:
    - User data is saved and retrieved from the cloud.
    - Sync works across devices.

## Phase 2: Core Tracking Features

### 2.1 Mood Tracking
- [ ] Mood Entry (1-10 Emoji Scale)
  - **Acceptance Criteria**:
    - Users can select from 10 emoji mood options (1-10).
    - Each entry is timestamped.
    - Unlimited entries per day.

### 2.2 Nutrition Tracking
- [ ] Meal Type Selection (Breakfast, Lunch, Dinner, Snacks)
  - **Acceptance Criteria**:
    - Users select meal type when adding entry.

- [ ] Food Database Picker & Search
  - **Acceptance Criteria**:
    - Users select foods from searchable database.
    - Foods display nutrition info (calories, protein, fat, carbs).

- [ ] Automatic Nutrition Calculation
  - **Acceptance Criteria**:
    - Selected foods auto-calculate and display nutrition totals for each meal.

- [ ] Edit/Delete Meal Entries
  - **Acceptance Criteria**:
    - Users can edit or delete existing meals.

### 2.3 Financial Tracking
- [ ] Manual Income/Expense Entry
  - **Acceptance Criteria**:
    - Unlimited income/expense entries can be added with amount, description, and category.

- [ ] Custom Categories for Transactions
  - **Acceptance Criteria**:
    - Users can create or edit expense/income categories.

- [ ] List & Review Transactions
  - **Acceptance Criteria**:
    - All records are displayed in a list with filters.

## Phase 3: Health Data Integration & Advanced Features
- [ ] Apple Health/Google Health Sync
  - **Acceptance Criteria**:
    - With user permission, app reads steps, sleep, weight.
    - Health data is displayed in daily summaries.

- [ ] Reminders & Notifications
  - **Acceptance Criteria**:
    - App sends push notifications for mood, meal, finance logs.
    - Users can enable/disable notifications in settings.

## Phase 4: Analytics, Export, & Premium
- [ ] Trends & Summaries Dashboard
  - **Acceptance Criteria**:
    - Weekly/monthly graphs for mood, nutrition, finance, and health.
    - Stats are visually clear and easy to understand.

- [ ] CSV/PDF Export (Premium)
  - **Acceptance Criteria**:
    - Paid users can export reports as CSV or PDF.
    - Free users see export feature but are prompted to upgrade.

- [ ] Premium Subscription Setup
  - **Acceptance Criteria**:
    - In-app purchase or subscription flow for premium analytics/features.
    - Premium users see extra analytics and export options.

## Phase 5: UI & Final Touches
- [ ] Minimalist Design Implementation
  - **Acceptance Criteria**:
    - UI follows minimalist design system.
    - Consistent padding, font sizes, and color palette.

- [ ] Dark Mode Support
  - **Acceptance Criteria**:
    - Users can toggle between light and dark themes.

- [ ] Settings Screen (Theme, Language, Notifications)
  - **Acceptance Criteria**:
    - Users can change language, theme, and notification settings anytime.

## How to Use This List
- Tackle one checkbox at a time, per phase.
- Test acceptance criteria before moving on.
- Mark completed tasks with x for progress tracking.