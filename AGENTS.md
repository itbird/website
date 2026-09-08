# PerishNet flow release procedure

For every change to `draft/flow.html`:

1. Synchronize the research fragment and standalone file in
   `D:/DocumentWarehouse_AutoSync/RMIT博士/博士思考3本体` with the website copy.
2. Update the visible version, actual modification time and CHANGELOG.md.
3. Check JavaScript syntax and the affected visual behavior.
4. Run `powershell -NoProfile -File scripts/sync-flow-nuc.ps1` from this repo.
   It backs up the NUC copy, verifies the upload hash and checks served content.
5. Commit and push the website and release notes. Verify the website deployment
   separately; a successful Git push does not confirm a live deployment.
6. Report GitHub/site and NUC status separately. If either fails, report the
   incomplete destination explicitly; do not claim both are synchronized.

NUC serves `/app/static/flow.html` through container `ontology-v2-web`, with
`/app` bind-mounted from
`/data/ZhongData/Data_PersonalFiles/400_Code/450_OntologyV2`.
Update the host file, not the read-only container mount. No restart is normally
needed. The sync script requires existing SSH access to `itbird@100.109.73.121`.
