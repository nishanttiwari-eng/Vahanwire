# Vahanwire – Dual-Role Booking Application

A production-grade **React Native** application that supports **dual user roles** — **User** and **Service Provider** — enabling real-time booking, offer negotiation, and booking acceptance workflows within a single codebase.

This project demonstrates scalable architecture, clean UI patterns, and role-based state handling suitable for real-world mobility or service-based platforms.

---

## Key Highlights

* Single codebase with **role-based UI & logic separation**
* Real-time booking lifecycle handling
* Offer submission & acceptance workflow
* Bottom-sheet based success & status modals
* Performance-optimized component rendering
* Clean and maintainable project structure

---

## Application Flow (High-Level)

1. User creates a booking request
2. Service Provider views booking details
3. Provider submits an offer
4. User accepts the offer
5. Success state is displayed with animated confirmation

This flow mirrors real-world service negotiation systems.

---

## Screenshots

| User Flow                                               | Service Provider Flow                                   |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![User Home](./screenshots/user_home.png)               | ![Provider Home](./screenshots/provider_home.png)       |
| ![Booking Details](./screenshots/booking_details.png)   | ![Offer Submission](./screenshots/offer_submission.png) |
| ![Booking Accepted](./screenshots/booking_accepted.png) | ![Success Modal](./screenshots/success_modal.png)       |

📁 All screenshots are located inside the `/screenshots` directory.

---

## Tech Stack

* **React Native** 0.74.0
* **React Navigation** (Stack & Tab)
* **Context API** for global state management
* **AsyncStorage** for role & session persistence
* Modular and reusable UI components

---

## Project Structure (Simplified)

```
src/
 ├── components/        # Reusable UI components
 ├── screens/           # Role-based screens
 ├── navigation/        # Navigation stacks
 ├── context/           # Global state (User / Provider)
 ├── services/          # API & business logic
 ├── utils/             # Helpers & constants
 └── assets/            # Images & icons
```

---

## Setup Instructions

### Prerequisites

* Node.js ≥ 18.x
* npm or yarn
* React Native CLI
* Android Studio (SDK + Emulator)
* Xcode (macOS only)
* Java JDK ≥ 17

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/vahanwire-app.git
cd vahanwire-app
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

#### 4. Start Metro Bundler

```bash
npx react-native start
```

#### 5. Run the Application

**Android**

```bash
npx react-native run-android
```

**iOS**

```bash
npx react-native run-ios
```

---

## APK for Quick Review

For faster evaluation without local setup:

🔗 **[Download APK](https://i.diawi.com/GHXbYm)**

> Enable *Install from Unknown Sources* on your device before installation.

---

## Engineering Considerations

* Clear separation of **business logic and UI**
* Role-based conditional rendering without duplication
* Scalable navigation architecture
* Optimized re-rendering using memoization patterns
* Ready for API or WebSocket-based real-time integration

---

## Scope for Enhancements

* WebSocket-based live booking updates
* Push notifications
* Role-based authentication & authorization
* Unit & integration testing (Jest)
* CI/CD pipeline for automated builds

---

## License

MIT

---

### Submission Note

This project was developed as part of a technical assessment to demonstrate:

* Real-world React Native architecture
* State management strategy
* UI/UX attention to detail
* Clean, maintainable, and scalable code practices
