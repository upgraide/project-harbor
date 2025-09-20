<p align="center">
   <img src="./public/assets/logo-light.png">
</p>

<p align="center">
	<h1 align="center"><b>Harbor Partners Web Applocation</b></h1>
<p align="center">
   A Harbor Exclusive WebApp é uma plataforma digital exclusiva, concebida
    para oferecer aos investidores uma experiência personalizada, confidencial e
    altamente eficiente no acesso a oportunidades de investimento.
    <br />
    <br />
    <a href="https://app.harborpartners.pt"><strong>Website</strong></a> ·
    <a href="https://upgraide-artificial-intelligence-lda.ghe.com/upgraide/harbor001/issues"><strong>Issues</strong></a> ·
    <a href="#whats-included"><strong>What's included</strong></a> ·
    <a href="#prerequisites"><strong>Prerequisites</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#deployment"><strong>Deploying to Production</strong></a>
  </p>
</p>

A interface é clara, intuitiva e responsiva, permitindo que o utilizador:

- Explore projetos filtrados automaticamente com base no seu perfi
- Visualize uma descrição detalhada de cada oportunidadP
- Consulte indicadores financeiros (Revenue, EBITDA, EV, etc ...)
- Aceda a documentos como Info Memos, Excel, imagens e planta
- Manifeste interesse via botões de Co-Invest ou Become Lead Investor, que notificam a equipa da Harbor
- Navegue em diferentes dispositivos (desktop, tablet ou mobile) com total fluidez

## What's included

[Convex](https://convex.dev/) - Database, storage, background jobs, validated server actions, cache, rate limiting<br>
[Next.js](https://nextjs.org/) - Framework<br>
[TypeScript](https://www.typescriptlang.org/) - Type safety<br>
[TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework<br>
[Eslint](https://eslint.org/) - Linter<br>
[Prettier](https://prettier.io/) - Formater<br>
[TailwindCSS](https://tailwindcss.com/) - Styling<br>
[Shadcn](https://ui.shadcn.com/) - UI components<br>
[TypeScript](https://www.typescriptlang.org/) - Type safety<br>
[i18n](https://next-international.vercel.app/) - Internationalization
[React Email](https://react.email/) - Email templates<br>
[Resend](https://resend.com/) - Email delivery<br>
[PostHog](https://posthog.com/) - Analytics<br>
[Husky](https://typicode.github.io/husky/) - Git hooks made easy<br>
[Lint-staged](https://github.com/okonet/lint-staged) - Run linters on staged files<br>
[next-themes](https://next-themes-example.vercel.app/) - Theme manager<br>

## Directory Structure

```
.
├── app/                         # Next.js app directory
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout component
├── docs/                        # Project documentation
│   └── ...
├── docs_client/                 # Client documentation and assets
│   ├── Documentos Recebidos/
│   └── Harbor Partners.pdf
├── lib/                         # Utility functions
│   └── utils.ts
├── public/                      # Static assets
│   └── ...
├── components.json              # Shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md
```

## Prerequisites

### Pnpm

Pnpm is the only prerequisite you need to install before getting started.

To install Pnpm, please follow the official installation instructions:

[Pnpm Installation Guide](https://pnpm.io/installation)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://upgraide-artificial-intelligence-lda.ghe.com/upgraide/harbor001
   cd harbor001
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   This starts the Next.js development server with Turbopack for faster builds.

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev` - Start the development server
- `pmpm build` - Build the application for production
- `pmpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier

## Deployment

To deploy the project to production, follow these steps:

### Deploying to Vercel

To be done with vercel CLI
