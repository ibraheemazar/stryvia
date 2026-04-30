# Phase 1B Context

## Overview

STRYVIA is an AI-powered product placement intelligence platform. It values brand
integration opportunities — product placements, on-screen branding, integrated
marketing — for TV and film, with regional production houses (Sadaf Productions,
Eagle Films, etc.) as the wedge customer.

Phase 1B builds the v0.1 product: the end-to-end producer flow from authentication
through project creation, script upload, AI analysis, producer review, valuation,
and final report. By the end of Phase 1B, a regional producer can sign up, upload
an Arabic-language script, watch the AI surface placement opportunities, accept or
reject each one, and download an executive-grade PDF report.

## Strategic framing

The Phase 1B customer is the **regional production house** — Sadaf, Eagle, and
their peers. This is deliberate: they are the wedge into MBC, Shahid, and the
streaming platforms in Phase 1C+. Producers move scripts and budgets; once they
are using STRYVIA to value placements pre-production, the platforms inherit the
data they need to monetize.

Because producers and platforms share boards, executives, and investor circles,
**every feature in Phase 1B must be demo-grade**. There is no internal tool
slack: an MBC executive may see a Sadaf workflow over someone's shoulder before
we have a Phase 1C deal in hand. Build accordingly.

## Architectural decisions

- **Auth: NextAuth.js.** Open source, sessions live in our infrastructure, no
  third-party identity service. Phase 1C will layer SAML/Okta on top; the
  NextAuth session model is forward-compatible.
- **Language: per-user preference, persisted in the user profile.** Not URL state,
  not localStorage — the chosen language persists across sessions and devices.
- **Primary language: Arabic-first, English-supported.** The AI prompts are
  designed for Arabic-language scripts as the primary case. English support is
  real, but it's the secondary path.
- **Demo philosophy: three engineered "wow moments."** These are first-class
  deliverables, not polish:
  1. **The AI Reveal** — watching analysis unfold in real time as the engine
     processes the script.
  2. **The Valuation Reasoning** — animated breakdown showing how each number
     was built, factor by factor.
  3. **The PDF Report** — executive-grade artifact a producer would put in front
     of a brand or platform without apology.

## The 10 sub-phases at a glance

| Sub-phase | Scope                                                                                  | Est.  |
| --------- | -------------------------------------------------------------------------------------- | ----- |
| 1B.A      | Authentication (NextAuth.js), user profile, language preference persistence            | 2 d   |
| 1B.B      | Project model, project list, project create flow                                       | 1.5 d |
| 1B.C      | Script upload (PDF/Final Draft/Fountain), parse + store, scene segmentation            | 2 d   |
| 1B.D      | AI analysis pipeline: scene → placement opportunity extraction (Arabic-primary prompt) | 3 d   |
| 1B.E      | The AI Reveal: real-time analysis UI streaming opportunities as they surface           | 2 d   |
| 1B.F      | Producer review queue: accept/reject/edit each opportunity                             | 1.5 d |
| 1B.G      | Valuation engine integration: each accepted opportunity gets a defensible price        | 2 d   |
| 1B.H      | The Valuation Reasoning: animated factor-by-factor breakdown                           | 2 d   |
| 1B.I      | The PDF Report: executive-grade artifact, both languages, full RTL                     | 2 d   |
| 1B.J      | End-to-end polish, demo seed data, Phase 1B exit smoke test                            | 1.5 d |

Total: ~19.5 working days.

## Non-goals (deferred to Phase 1C+)

The following are explicitly **out of scope** for Phase 1B. Do not preempt them.

- **Brand-side portal.** `apps/brand` exists for tooling reasons only.
- **Billing / Stripe.** No subscriptions, no metering, no invoicing.
- **SAML / Okta SSO.** Producers sign in with email + password via NextAuth.
- **SOC 2 work.** Compliance posture comes after the wedge lands.
- **Multi-script aggregation.** Each project is one script in 1B.
- **Post-air ROI reporting.** 1B values placements pre-production only.
- **Mobile apps.** Web only. Desktop-first responsive on tablet at most.

If a Phase 1B feature seems to require any of the above, stop and re-scope the
feature instead of pulling the deferred work forward.
