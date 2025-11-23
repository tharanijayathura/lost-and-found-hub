# Lost & Found Hub 📱

A modern React Native mobile application built with Expo for university students to manage lost and found items. Features a beautiful UI with dark/light mode support, user authentication, and comprehensive item management.

## ✨ Features

### 🔐 Authentication
- **User Registration**: Create an account with name, email, and password
- **Secure Login**: Email and password authentication
- **User Persistence**: Stay logged in across app restarts
- **Profile Management**: Edit profile information including name, email, phone, and student ID

### 📦 Item Management
- **Add Lost Items**: Create listings with title, description, location, date, category, and images
- **Edit Items**: Update item details anytime
- **Delete Items**: Mark items as found and remove them
- **View Details**: Full item information with images
- **Image Support**: Add photos to items using device camera roll

### ⭐ Favorites
- **Mark Favorites**: Heart icon to favorite important items
- **Favorites Filter**: View only your favorite items
- **Quick Access**: Easy access to frequently needed items

### 🎨 Theme Support
- **Dark Mode**: Beautiful dark theme for low-light viewing
- **Light Mode**: Clean light theme for daytime use
- **Auto Mode**: Automatically follows system theme settings
- **Theme Persistence**: Your theme preference is saved

### 🎯 Additional Features
- **Category System**: Organize items by categories (Electronics, Personal Items, Clothing, Books, etc.)
- **Search & Filter**: Filter items by favorites
- **Modern UI**: Gradient designs, smooth animations, and intuitive navigation
- **Responsive Design**: Works seamlessly on iOS and Android

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tharanijayathura/lost-and-found-hub.git
   cd lost-and-found-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - The app will load on your device

### Alternative: Run on Simulator/Emulator

```bash
# For iOS Simulator
npm run ios

# For Android Emulator
npm run android

# For Web
npm run web
```

## 📱 Usage

### Registration & Login
1. Open the app and tap **"Sign Up"** on the login screen
2. Fill in your name, email, and password
3. After successful registration, you'll be redirected to the login screen
4. Enter your credentials to log in

### Adding Items
1. From the home screen, tap the **"+"** button
2. Fill in the item details:
   - Title (required)
   - Description
   - Location (required)
   - Category
   - Date lost
   - Image (optional)
3. Tap **"Add Item"** to save

### Managing Items
- **View Details**: Tap any item card to see full details
- **Edit**: Tap "Edit Item" on the details screen
- **Delete**: Tap "Mark as Found" to remove an item
- **Favorite**: Tap the heart icon on any item card

### Profile Management
1. Tap your profile icon in the header or navigate to Profile
2. Tap **"Edit Profile"** to modify your information
3. Change theme settings in the **"Appearance"** section
4. Tap **"Save Changes"** when done

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Storage**: AsyncStorage for data persistence
- **UI Components**: Custom components with Expo Linear Gradient
- **Image Handling**: Expo Image & Image Picker
- **Icons**: Expo Vector Icons (Ionicons)
- **Language**: TypeScript

## 📁 Project Structure

```
lost-and-found-hub/
├── app/
│   ├── (auth)/          # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (main)/          # Main app screens
│   │   ├── home.tsx
│   │   ├── add-item.tsx
│   │   ├── edit-item.tsx
│   │   ├── item-details.tsx
│   │   └── profile.tsx
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
│   ├── CustomButton.tsx
│   ├── InputField.tsx
│   └── ItemCard.tsx
├── constants/
│   ├── Colors.ts        # Theme colors
│   ├── ThemeContext.tsx # Theme management
│   └── context/
│       ├── AuthContext.tsx
│       └── ItemContext.tsx
└── assets/              # Images and fonts
```

## 🎨 Features in Detail

### Authentication System
- Secure user registration and login
- User data stored locally with AsyncStorage
- Session persistence across app restarts
- Profile editing with image upload support

### Item Management
- Full CRUD operations (Create, Read, Update, Delete)
- Image upload from device gallery
- Category-based organization
- Date tracking for lost items

### Theme System
- Three theme modes: Light, Dark, and Auto
- Smooth theme transitions
- Persistent theme preferences
- Theme-aware components throughout the app

## 📝 Notes

- This is a **frontend-only** application with mock data
- User authentication is handled locally (not connected to a backend)
- Images are stored as local URIs (not uploaded to a server)
- Perfect for learning React Native and Expo development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and for educational purposes.

## 👨‍💻 Author

Created for university students to manage lost and found items.

---

**Built with ❤️ using React Native and Expo**

