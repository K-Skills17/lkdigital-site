I. General Coding Principles
Component-Driven: Build all UI elements as small, reusable Atomic Components (Buttons, Cards, Inputs).

Scalability: Use a folder structure that separates the "Site" (Marketing) from the future "App" (Dashboard).

Path suggestion: /src/components/marketing and /src/components/shared.

Accessibility: Every image must have descriptive alt text. Use semantic HTML (<main>, <section>, <article>).

II. GEO & LLM Optimization (The "Intelligence" Layer)
Structured Data: Implement Organization and MedicalBusiness schema on the Homepage.

Answer Chunks: Structure Blog and Service sections in 75–300 word "Answer Blocks" that provide direct definitions of dental marketing terms.

llms.txt: Create an /llms.txt file at the root that provides a markdown-based summary of the site’s authority pillars for AI crawlers.

Schema: Every blog post must include Article schema with author and datePublished.

III. Language & Tone (Portuguese)
Formal Tone: Use "Você" or "Sua Clínica." The tone must be "Consultive Elite."

No Slang: Avoid "Gatilhos mentais" or "Growth hacking" in the main copy. Use "Alavancagem estratégica" and "Aquisição de precisão."

IV. Constraints
Performance: Maintain a Lighthouse score of 95+ for Performance and SEO.

No Backend (V1): Use client-side state or simple form endpoints (e.g., Formspree or Resend) for the contact form. Do not build complex DB schemas yet, but keep the user types in mind.