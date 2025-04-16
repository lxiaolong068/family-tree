# Family Tree Website

[中文说明 (README 中文版)](./README.md)

## Project Overview
This project is a visual family tree creation and display platform built with Next.js 14, TypeScript, pnpm, and Shadcn UI. It is designed for genealogy beginners, family history enthusiasts, and anyone interested in building and sharing family trees. The platform supports tree generation, template display, knowledge sharing, and SEO optimization.

## Main Features
- Home page: Project introduction and navigation
- Genealogy knowledge: Basic knowledge and FAQs
- Template showcase: Multiple downloadable templates (images/tables)
- Family tree generator: Input member info to generate tree structure
- Responsive design for mobile devices
- Planned: Drag-and-drop editor, export (PNG/PDF/JSON), AI assistant, more

## Tech Stack
- Package manager: pnpm
- Frontend: Next.js 14
- UI: Shadcn UI (Tailwind CSS based)
- Language: TypeScript
- Visualization: Mermaid.js (planned)
- Others: html2canvas, jsPDF (for export, planned)

## Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Directory Structure
```
family-tree/
├── app/                # Next.js 14 App Router
├── components/         # UI components (Shadcn UI)
├── public/             # Static assets
├── src/lib/            # Utilities and shared logic
├── docs/               # Requirements and plans
├── README.md           # Chinese README
├── README.en.md        # English README
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind config
└── ...
```

## Roadmap
- Drag-and-drop family tree editor
- Local/cloud data storage and import/export
- Family tree visualization (Mermaid.js/SVG)
- AI-powered genealogy analysis and completion
- Collaborative editing
- Multi-language support and admin management

## References
- [开发计划 (Development Plan)](./docs/family-tree-dev-plan.md)
- [Next.js Documentation](https://nextjs.org/)
- [Shadcn UI Docs](https://ui.shadcn.com/)

---

For suggestions or feature requests, please open an issue!
