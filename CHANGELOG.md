# Changelog

Human-readable changes to the PerishNet research flow (`draft/flow.html`).
Other website changes remain available in the full Git history. This is a
retrospective of verified flow commits, not a complete website release history.

Times below are Git commit times in Australia/Sydney (UTC+10 for these dates),
not confirmed deployment times. Earlier small changes retained version 1.8.

## 1.9.1 - 2026-09-08 20:46 +10:00

- Fixed: Method highlighting ran outside drawJourney and referenced local
  variables remaining/active, stopping initialization with a ReferenceError.
  Move it into the animation function so controls and motion can initialize.
- Verification: NUC browser showed changing traveller coordinates and a working
  pause control. Upload hash and served HTTP content were verified.

## 1.9 - 2026-09-08 20:39:25 +10:00

Commit: `23cddcd`

- Changed: Route case results through evaluation before expected contributions
  and the expected research claim. Highlight the associated method block when
  the narrative reaches GOPFD, CCIEO or WALDRO.
- Changed: Clarify shelf-life model applicability, assessment plus logistics
  inputs to WasteRiskCondition, evidence traces, action windows, candidate
  interventions, baseline comparisons and planned standards reuse in details.
- Reason: Make the relationship between research methods, case results and
  evidence for contributions clearer while retaining all three RQ statements.
- Verification: JavaScript syntax check and `git diff --check` passed; push
  succeeded. No browser layout or end-to-end animation check was recorded for
  this revision. Deployment was not independently confirmed in that update.

## 1.8 layout update - 2026-09-04 19:12:10 +10:00

Commit: `1539778`

- Changed: Align WasteRiskCondition with the CCIEO and AI method column;
  recenter its text and adjust incoming and outgoing arrow endpoints.
- Reason: Keep the three blocks aligned and the arrows attached to the node.
- Verification: Diff check and push succeeded; browser verification not recorded.

## 1.8 layout update - 2026-09-04 19:09:51 +10:00

Commit: `963aaf3`

- Changed: Move the case-evidence arrow label down and adjust its curve.
- Reason: Increase clearance below the RQ1 block for all three scenarios.
- Verification: Diff check and push succeeded; browser verification not recorded.

## 1.8 controls update - 2026-09-04 19:07:43 +10:00

Commit: `ede6c43`

- Changed: Keep Case scenario and its selector on one line and restore the
  native dropdown appearance.
- Reason: Avoid a wrapped label and make the selector recognizable.
- Verification: Diff check and push succeeded; browser verification not recorded.

## 1.8 initial publication - 2026-09-04 16:45:50 +10:00

Commit: `862aa9f`

- Changed: Publish the standalone research flow as `draft/flow.html`.
- Reason: Provide a short, shareable presentation URL.
- Verification: The live URL returned HTTP 200 with PerishNet content and
  version 1.8. This verified publication, not every interactive feature.

## Recording future updates

### Deployment follow-up - 2026-09-08 20:44 +10:00

- Synchronized version 1.9 to the NUC Streamlit static endpoint, which had
  remained on 1.8. Backed up the previous file before replacement.
- Verified SHA256 of the upload and exact HTTP response content against
  `draft/flow.html`. No service restart was required.
- Added `scripts/sync-flow-nuc.ps1` and `AGENTS.md` to require NUC synchronization
  and separate deployment verification for subsequent flow changes.

For each subsequent flow update, add an entry in the same commit:

- Version and actual local change time, including timezone.
- What changed and why.
- Checks performed, their outcomes, and any verification not performed.
- Publication status: distinguish committed/pushed from verified live.

Use a patch version for small fixes (for example, 1.9.1) and a minor version
for a coherent feature update (for example, 1.10). Keep the flow's visible
version and last-modified time in sync. Do not invent checks or deployment
times. A new entry need not contain its own commit hash; Git provides it.
