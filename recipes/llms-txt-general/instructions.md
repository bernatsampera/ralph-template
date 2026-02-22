### Recipe: Create llms.txt Documentation for Any Subject

Read `specs/llms-txt-general-guide.md` to understand the llms.txt documentation system and how it applies to general subjects (not just codebases).

The user has specified a **subject** to document. This could be a website, documentation site, book, API reference, framework, concept, or any other topic. Identify:

1. **What** the subject is (e.g., "FastAPI documentation", "Clean Architecture book", "Stripe API")
2. **Where** the source material lives (URL, local files, or your own knowledge)
3. **The structure** of the subject — its major sections, topics, or chapters

If the source is a URL, explore it to understand its structure and content hierarchy. If it is a book or concept, use your knowledge to design an appropriate hierarchy.

**Link to original URLs.** Do NOT create local `.md` files to store content that already exists at a URL. The llms.txt files should link directly to the original source pages. Only create local `.md` files when:
- The source material has no URL (e.g., knowledge-based content about a book or concept)
- The content is **synthesized** from dispersed sources and doesn't exist anywhere online as a single page (e.g., decision frameworks comparing options, strategy guides by profile, cross-cutting summaries that combine information from multiple sources)

Create tasks in `fix_plan.md` to produce llms.txt files for this subject:
1. Root llms.txt first — overview of the entire subject
2. Major topic/section llms.txt files next — one per major area
3. Sub-topic llms.txt files as needed for complex areas

Each task should create ONE llms.txt navigation file. Be specific about:
- The exact file path to create
- What content it should contain
- What original URLs it should link to
- What links it should include to other llms.txt files in the hierarchy

Output all files into the parent directory (../) so the llms.txt tree lives alongside this ralph directory.
