# Family Tree Website

[中文说明 (README 中文版)](./README.md)

## Project Overview
This project is a visual family tree creation and display platform built with Next.js 14, TypeScript, pnpm, and Shadcn UI. It is designed for genealogy beginners, family history enthusiasts, and anyone interested in building and sharing family trees. The platform supports tree generation, template display, knowledge sharing, and SEO optimization.

## Main Features
- Home page: Project introduction and navigation
- Genealogy knowledge: Basic knowledge and FAQs
- Template showcase: Multiple downloadable templates (images/tables)
- Family tree generator: Input member info to generate tree structure
- User authentication: Google account login with user-family tree data association
- Data storage: Local storage and Neon database cloud storage
- Responsive design for mobile devices
- Planned: Drag-and-drop editor, export (PNG/PDF/JSON), AI assistant, more

## Tech Stack
- Package manager: pnpm
- Frontend: Next.js 14
- UI: Shadcn UI (Tailwind CSS based)
- Language: TypeScript
- Visualization: Mermaid.js
- Authentication: Firebase Authentication (Google login)
- Token verification: jsonwebtoken, jwks-rsa
- Database: Neon PostgreSQL
- Testing: Jest, React Testing Library
- Others: html2canvas, jsPDF (for export, planned)

## Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:
   Create a `.env.local` file with the following configuration:
   ```
   # Database
   NEON_DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_HAS_DATABASE=true

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_CLIENT_ID=your_firebase_client_id

   # Firebase Admin SDK (for token verification)
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

   > Note: To get Firebase Admin SDK credentials, create a service account in the Firebase console and download the private key JSON file.

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

This project uses Jest and React Testing Library for unit and component testing.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Generate test coverage report
pnpm test:coverage

# Run end-to-end tests (Playwright)
pnpm test:e2e
```

### Test Structure

```
family-tree/
├── src/
│   ├── lib/__tests__/          # Unit tests for utility functions
│   ├── components/__tests__/    # Component tests
│   ├── app/**/__tests__/        # Page tests
│   └── types/testing.d.ts       # Test type definitions
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup
└── .github/workflows/test.yml   # CI testing workflow
```

### Test Coverage

The target test coverage is to reach at least 75% for core functionality. Current tests mainly focus on:

- Utility functions and logic
- Component rendering and interactions
- Page routing and authentication logic

## Directory Structure
```
family-tree/
├── src/                # Source code directory
│   ├── app/            # Next.js 14 App Router
│   ├── components/     # UI components (Shadcn UI)
│   ├── contexts/       # React Contexts (auth, etc.)
│   ├── db/             # Database schema and connection
│   ├── lib/            # Utilities and shared logic
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── docs/               # Requirements and plans
├── tests/              # Test files
├── README.md           # Chinese README
├── README.en.md        # English README
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind config
└── ...
```

## Implemented Features
- Family tree generator (add, delete members)
- Family tree visualization (Mermaid.js)
- Local and cloud data storage
- User authentication system (Google login)
- User account and family tree data association
- Secure token verification mechanism
- Responsive design for mobile and desktop
- User profile page
- Unit and component testing framework

## Roadmap
- User profile page
- Drag-and-drop family tree editor
- Export family tree as image/PDF
- Enhanced relationship settings (spouses, siblings, etc.)
- AI-powered genealogy analysis and completion
- Collaborative editing
- Multi-language support and admin management

## References
- [开发计划 (Development Plan)](./docs/family-tree-dev-plan.md)
- [Next.js Documentation](https://nextjs.org/)
- [Shadcn UI Docs](https://ui.shadcn.com/)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [JWT Documentation](https://jwt.io/)

---

For suggestions or feature requests, please open an issue!
