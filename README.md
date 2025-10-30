# DACI Role Assignment Assistant

An interactive decision intelligence workspace that analyzes project requirements, stakeholder expertise, and organizational dynamics to recommend optimal DACI (Driver, Approver, Contributor, Informed) role assignments.

## Features

- **Decision-aware scoring engine** – Multi-factor scoring across expertise alignment, leadership strength, influence, availability, and organizational knowledge.
- **Dynamic project context** – Update project brief, criticality, urgency, and required skills to see recommendations adjust instantly.
- **Stakeholder portfolio management** – Capture department, seniority, experience, and domain expertise; add/remove stakeholders on the fly.
- **AI-backed recommendations** – Primary and alternate candidates for every DACI role with justification trails and risk callouts.
- **Coverage analytics** – Gauge department representation, expertise coverage, and leadership bench depth.
- **Insight surfacing** – Guardrails highlight governance risks, contributor gaps, or missing influencers.

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. The app loads with a seeded project and stakeholder map so you can explore recommendations immediately.

### Scripts

- `pnpm dev` – Start Vite development server with fast refresh.
- `pnpm build` – Type-check and produce a production build.
- `pnpm preview` – Preview the production build locally.
- `pnpm lint` – Run ESLint across the `src` directory.

## Architecture Overview

- `src/lib/roleEngine.ts` – Core heuristics that score every stakeholder for each DACI role, apply constraints, synthesize insights, and emit coverage metrics.
- `src/hooks/useAssignmentEngine.ts` – Orchestrates project/stakeholder state and runs the engine.
- `src/components` – Presentational building blocks for project briefing, stakeholder management, recommendations, analytics, and summaries.
- `src/data/sampleData.ts` – Starter dataset used on first load; replace with live data integrations as needed.

## Extending the Assistant

- Integrate collaboration platforms (Slack/Teams/Confluence) by transforming exported conversations into the `AssignmentContext` shape and passing them to the engine.
- Add constraint rules (e.g., mandatory approver, role exclusions) through the `constraints` field in the context object.
- Persist scenarios by serializing the context/result payloads via your preferred backend.
- Hook in LLM-generated rationale by augmenting `EngineResult.summary` with model outputs.

## License

This project is provided as-is for internal evaluation. Adapt licensing to suit your organization before production use.
