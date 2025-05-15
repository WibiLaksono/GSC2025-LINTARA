
# 🗑️♻️Lintara: Mobile Application to Solve Waste Problems

Lintara is a mobile application that helps solve waste problems with various interactive and collaborative features. Designed to encourage environmental awareness, Lintara facilitates waste reporting, community, challenges, and tracking of user contributions to waste management.

## 🎯 Key Features

- **Waste Reporting**  
  Users can report the waste they find. The application will identify the type of waste and provide follow-up suggestions.

- **Community**  
  Users can share experiences and waste findings to the public through the community feature.

- **Challenges**  
  Users can create or join environmental-themed challenges. Challenges have goals and prizes.

- **Leaderboard**  
  View user rankings based on their contributions in reporting and participating in challenges.

- **Account Management**  
  Users can manage their accounts, posts, and challenges.

- **Authentication with Firebase & JWT**  
  Users can register using email and password (via Firebase Auth). After successful registration/login, the backend will generate a JWT to be used for secure API requests.

## 🧰 Technology Used

### Mobile (React Native + Expo)
- **React Native** `0.79.2`
- **Expo** `53`
- **Expo Router**
- **Tailwind CSS via NativeWind**
- **State Management**: Zustand
- **Media & Kamera**: `expo-camera`, `expo-media-library`, `expo-image-picker`
- **UI**: `expo-blur`, `expo-haptics`, `react-native-vector-icons`, `react-native-svg`

### Backend (Express.js + Node.js)
- **Framework**: Express.js
- **Image Upload**: Multer
- **Auth**: Firebase Auth, JWT, bcrypt
  - Register with **Email and Password** using **Firebase Authentication**
  - Generate a **JWT token** after successful registration or login for secure API access
- **AI Integrasi**: Gemini Pro Vision
- **Database**: Firebase (Firestore)
- **Middleware**: CORS, dotenv

## 🚀 Getting Started

### 🔁 Clone the Repository

```bash
git clone https://github.com/WibiLaksono/GSC2025-LINTARA.git
cd GSC2025-LINTARA
```

### 📦 Prerequisites
- Node.js v18 or later (v20+ recommended)
- npm / yarn / pnpm

### ⚙️ Environment Configuration

Create a `.env` file in the Bakend folder with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

FIREBASE_PRIVATE_KEY=YOUR_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL=YOUR_CLIENT_EMAIL

JWT_SECRET=YOUR_JWT_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 📲 Run the Application

#### Backend

```bash
cd backend
npm install
node index.js
```

#### Mobile

```bash
cd mobile
npm install
npx expo start
```

## 📁 Directory Structure

### Backend

```
backend/
├── Config/
│   └── firebase.js
├── Controllers/
│   ├── authControllers.js
│   ├── challengeController.js
│   ├── challengeHistoricalController.js
│   ├── commentController.js
│   ├── followersController.js
│   ├── likePostController.js
│   ├── postsController.js
│   ├── reportController.js
│   └── userControllers.js
├── Routes/
│   ├── authRoutes.js
│   ├── challengeHistoricalRoutes.js
│   ├── challengeRoutes.js
│   ├── commentRoutes.js
│   ├── followerRoutes.js
│   ├── likePostRoutes.js
│   ├── postsRoutes.js
│   ├── reportRoutes.js
│   └── userRoutes.js
├── index.js
├── package.json
├── package-lock.json
└── .gitignore
```

### Mobile

```
mobile/
├── App/
│   ├── (tabs)/
│   │   ├── Challenge/
│   │   │   ├── Detail/[id].tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── Join.tsx
│   │   │   └── make.tsx
│   │   ├── Community/
│   │   │   ├── _layout.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Index.tsx
│   │   │   └── search.tsx
│   │   ├── Profile/
│   │   │   ├── _layout.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── index.tsx
│   │   ├── _layout.tsx
│   │   ├── Action.tsx
│   │   └── leaderboard.tsx
│   ├── Auth/
│   │   ├── registerPage.tsx
│   │   └── loginPage.tsx
│   ├── _layout.tsx
│   ├── Global.css
│   └── index.tsx
├── Assets/
│   ├── Action-img/
│   ├── Fonts/
│   ├── Icons/
│   ├── Images/
│   └── post-images/
├── Services/
│   ├── authService.js
│   ├── challengeService.js
│   ├── communityService.js
│   ├── followService.js
│   ├── leaderboardService.js
│   ├── reportService.js
│   └── userService.js
├── App.json
├── .gitignore
├── babel.config.json
├── eslint.config.json
├── metro.config.json
├── nativewind-env.d.ts
├── package-lock.json
├── package.json
├── react-native-vector-icons.d.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

🛠️ Created by: **Team Doa Ibu**
