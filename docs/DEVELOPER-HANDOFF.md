# Developer handoff

## Run locally
Install a current Node.js release. From the extracted package folder run:

    node tools/preview-server.mjs site/dist

Open http://127.0.0.1:8891/ and http://127.0.0.1:8891/walkthrough. The server binds to localhost and supports extensionless HTML routes and audio byte ranges. Stop it with Ctrl+C. Use an HTTP server rather than opening files directly because the intervention JSON and audio use fetch and browser origin storage.

## Runtime map
- session.js: storage namespaces, attempt records, item banks, persistence and recovery.
- skill-catalog.js and prek-catalog.js: skills, standards references, generated problem families and representations.
- race-protocol.js: overrides base Fluency session methods with fixed timed balanced forms, official-attempt selection, baseline and passing logic. Preserve script load order. Do not implement integration from session.js alone.
- race-timer.js and connected-game.js: active timing, assessment completion, interruptions and race response handling.
- student-pathway.js, student-coach.js and dashboard.js: independent progression and student guidance.
- warmup-engine.js and warmup.js: targeted unscored practice.
- rosenbaum.js: legacy presentation engine; rosenbaum-bridge.js adapts saved Fluency evidence into the race and report surfaces.
- reports.js, teacher-heatmap.js and teacher-notes.js: current reports, family-level evidence and possible instructional moves.
- demo-samples.js, demo-class.js and connected-demo.js: explicitly simulated sample evidence.
- walkthrough.js, podcast-chapters.js, podcast-visual-cues.js and podcast-cue-player.js: audio-driven sections, exact targets, gold highlighting, horizontal heatmap scroll and custom chart.
- store-engine.js, store.js, horse-store-catalog.js, race-skins.js and artwork files: browser-local cosmetic rewards.

## Hosting
The live site uses Sites static hosting with dist as its static directory. Project ID: appgprj_6ac4522eee148191adf3ef2f44811522. Last verified publication in this working session: version 58, commit 601c1ead080e759818ac1523f668015ffd2340e7. Site ownership and deployment credentials are not transferable through this ZIP. To publish elsewhere, serve site/dist as the static document root with extensionless routes mapping to corresponding HTML files and byte-range support for MP3 playback. Never put hosting credentials into client JavaScript.

## Narration and validation
The finished recording keeps the two original recorded voices. The edited timeline has 13 sections, 40 visual cues and 3,432 retained-word audit entries. The prior browser audit passed all 40 cue targets. Normal playback was checked across the Make10 heatmap scroll and teacher-model boundary. The heatmap scrolls to Make10 and highlights the narrated target; the simulated graph and teacher suggestions use the same underlying records. Word timestamps are derived from transcription and some are approximate. The word audit is not a human listening certification of every word.

The walkthrough graph uses simulated scores 17, 19, 18, 23, 20, 29, 30, 29 out of 30. Dates and classroom events are intentionally compressed. The recording includes teaching examples 7+3 and 6+4 within the selected skill. Keep audio, transcript, chapter boundaries, cue times and synthetic data synchronized when changing narration.

## Known issues and decisions for production
- Browser-local preview, with no verified server sync, roster login, student identity matching or district platform writeback.
- First visit differs from a returning browser because mode and progress persist; no uniform staff landing screen yet.
- Timing values for advanced and Pre-K skills are local pilot choices, not validated fluency benchmarks. Balanced forms have not been established as psychometrically equivalent.
- Some reusable template and legacy screen text may describe stricter teacher-review criteria than the automatic completion flag. Read the rules document for the exact distinction.
- A temporary hosted 500 error was reported. Subsequent anonymous requests and browser loads recovered with HTTP 200; exact root cause was not established. No incident logs proving the cause were available.
- Data protection, multiuser access, server validation, retention policy and accessibility/device testing require production work.

## Suggested integration contract
Keep a district student ID, school, grade, assigned skill, protocol version/signature, form ID, assessment date, attempt ID, first-response detail and official versus retake designation. Separate raw evidence from derived baseline/streak/completion summaries. Preserve warmups and teacher notes as distinct record types. Make writes idempotent by attempt ID. Apply permissions and scoring on the server. This is a proposed contract, not an implemented API. Reconcile skill IDs and teaching-review rules with Alicia's platform before implementation.

## Running the archived verification scripts
The verification scripts retain their original workspace paths and are included as audit evidence. To run them from this package, place or copy site as math-race-arcade beside those scripts, or update their source-path constants. Historical visual checks can also require the browser and media utilities used during development. The local preview command above runs directly with the included package layout.
