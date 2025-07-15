# Gemini Frontend Clone

**🔗 Live Demo**: [https://gemini-frontend-clone-qx4sna2yj-pawars-projects-b6c0442d.vercel.app/]
**📁 GitHub Repo**: [https://github.com/krishnakant20/Gemini-Frontend-Clone.git]

---

## 📌 Overview
It includes:

- OTP authentication  
- Chatroom management  
- AI simulation with throttled responses  
- Image upload + preview  
- Responsive & accessible UI  
- Full client-side state with `localStorage`

Built using **Next.js 15**, **Zustand**, **Tailwind CSS**, and **React Hook Form + Zod**.

---

## 🚀 Features

### ✅ Authentication

- OTP-based login (simulated via `setTimeout`)
- Dynamic country code selection (via [restcountries.com](https://restcountries.com))
- Input validation with React Hook Form + Zod
- Zustand-based auth state & routing guard

### ✅ Dashboard

- Chatroom list with Create/Delete actions
- Toast confirmations for key actions
- Keyboard-friendly input (Enter key support)

### ✅ Chatroom Interface

- Simulated AI replies (delayed & throttled)
- Typing indicator
- Reverse infinite scroll
- Image upload and inline preview (base64)
- Copy-to-clipboard on message click
- Auto-scroll to latest message

### ✅ Global UX

- Mobile responsiveness (fully adaptive)
- Debounced search for chatrooms
- Keyboard accessibility (Enter)
- Toast notifications
- All data persisted in `localStorage`

---

## 🛠️ Tech Stack

| Feature            | Tech / Library                                  |
|--------------------|--------------------------------------------------|
| Framework          | Next.js 15 (App Router)                          |
| State Management   | Zustand                                          |
| Form Validation    | React Hook Form + Zod                            |
| Styling            | Tailwind CSS                                     |
| Notifications      | React Toastify                                   |
| Icons              | Lucide React                                     |
| Country API        | [restcountries.com](https://restcountries.com)   |
| Deployment         | Netlify                                          |

---

## 📁 Folder Structure
```
gemini-frontend-clone/
├── app/
│   ├── auth/
│   │   └── login/             # OTP login form
│   ├── chatroom/
│   │   └── [id]/              # Chat interface page
│   ├── dashboard/             # User's chatrooms
│   ├── layout.jsx             # App layout with dark mode support
│   └── page.jsx             # App layout with dark mode support

├── components/
│   ├── Header.jsx             # Top bar with dark mode toggle
│   ├── Sidebar.jsx            # Responsive sidebar with search + rooms
│   └── ConfirmToast.jsx       # Reusable confirm dialog

├── store/
│   ├── chatStore.js           # Zustand store for chatrooms/messages
│   └── userStore.js           # Zustand store for auth state

├── utils/
│   
│   

├── styles/
│   └── globals.css            # Tailwind base styles

└── README.md
```


---

## 🧠 Core Feature Implementation

### 🧩 Form Validation

- Zod + React Hook Form for OTP and phone number
- 10-digit phone number enforced
- 4-digit numeric OTP input

### 💬 Throttled AI Response

- Replies simulated via `setTimeout`
- Messages queued with `aiQueue`
- Replies delayed 2s to mimic AI thinking

### ⬆️ Reverse Infinite Scroll

- Scroll to top triggers `loadOlderMessages()`
- Messages preserved in `localStorage`

### 🖼️ Image Upload

- `FileReader` used for local preview (base64)
- Displayed inline inside message bubble
- Preview removable before sending

### 🔒 LocalStorage

- Stores:
  - Auth (phone, country)
  - Chatrooms
  - Chat messages
- On refresh: Zustand rehydrates from `localStorage`

---

## 💡 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/gemini-frontend-clone.git
cd gemini-frontend-clone

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev

# 4. Open in browser
http://localhost:3000

