# 🥗 Lunchefy

A personal project for organizing recipes and planning meals for each day.

## ✨ Features

- 📚 **Recipe Management**
  - Create, edit, and delete recipes.
  - Upload custom images or use external image URLs.
  - Add tags to recipes for better organization and similarity-based linking.
- 📆 **Meal Planning**
  - Assign recipes to specific days.
  - Visual overview of current and past meals.
  - Identify recipes that haven’t been cooked in a while.
- 👥 **Sharing & Collaboration**
  - Create groups and invite others to collaborate on recipe collections.
  - Shared calendar and group planning.

## 🛠️ Tech Stack

**Frontend**

- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS, ShadCN UI
- **State Management:** Zustand
- **Language:** TypeScript

**Backend**

- **Backend + Database:** Convex
- **Authentication:** Clerk

## 💻 Live Demo

[https://lunchefy.vercel.app/](https://lunchefy.vercel.app/)

```bash
Demo user credentials:
Email: lunchefy@gmail.com
Password: v7kJM53F5MNpcMhQG@4e
```

## 🧪 Local Development

```bash
git clone https://github.com/MartinOpravil/Lunchefy.git
cd lunchefy
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 🔐 Environment Variables

To run the project locally, create a **.env.local** file in root of a project with the following variables and provide your values:

```bash
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL='/app'
NEXT_FALLBACK_REDIRECT_URL='/'
```

### 📁 Folder Structure

```bash
/app        -> App Router structure (pages, layouts)
/components -> Reusable UI components and app-specific components
  /global     -> Shared UI elements (buttons, inputs, icons, loaders)
  /group      -> Components for group management (access manager, items, buttons)
  /home       -> Homepage-specific components
  /layout     -> Layout-specific components (header, switchers)
  /planner    -> Planner-specific components (calendar, buttons)
  /recipe     -> Recipe-specific components (wysiwyg editor, tags, items, lists, buttons)
  /ui         -> Base ShadCN components
  /user       -> User-specific components
/constants  -> Static constants (form schemas, reusable strings and values)
/convex     -> Convex backend functions (queries, mutations, schema)
/enums      -> Enumerations used across the app
/hooks      -> Custom React hooks
/i18n       -> Translation files and configuration
/lib        -> Utility functions and helpers
/providers  -> Application-wide context providers
/public     -> Static assets (icons for tags, images)
/store      -> Zustand store for global state management
/styles     -> Global CSS styles and theme customizations for Tailwind
/types      -> Global TypeScript types and interfaces
```
