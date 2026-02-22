### Recipe: Create llms.txt Documentation for Any Subject

Read `specs/llms-txt-general-guide.md` to understand the llms.txt documentation system and how it applies to general subjects (not just codebases).

The user has specified a **subject** to document. This could be a website, documentation site, book, API reference, framework, concept, or any other topic. Identify:

1. **What** the subject is (e.g., "FastAPI documentation", "Clean Architecture book", "Stripe API")
2. **Where** the source material lives (URL, local files, or your own knowledge)
3. **The structure** of the subject — its major sections, topics, or chapters

If the source is a URL, explore it to understand its structure and content hierarchy. If it is a book or concept, use your knowledge to design an appropriate hierarchy.

Create tasks in `fix_plan.md` to produce llms.txt files for this subject:
1. Root llms.txt first — overview of the entire subject
2. Major topic/section llms.txt files next — one per major area
3. Sub-topic llms.txt files as needed for complex areas
4. Leaf documentation files (.md) for detailed content

Each task should create ONE file. Be specific about:
- The exact file path to create
- What content it should contain
- What source material to reference or summarize
- What links it should include to other files in the hierarchy

Output all files into the parent directory (../) so the llms.txt tree lives alongside this ralph directory.
