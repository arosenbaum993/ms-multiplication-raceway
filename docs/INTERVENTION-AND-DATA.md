# Intervention rules and data handoff

Prepared for Alicia Rosenbaum on October 8, 2026. This document describes the current public Math Race Arcade / My Race Pathway source, rather than a future district integration. Source references below are relative to the included site code folder, with all application files under dist/.

## What the intervention does

The instructional cycle is: review recent missed facts, model a useful strategy, guide practice with feedback, provide a warm-up, administer an independent scored race, review first-response errors, and revisit retention later. The game provides engagement and evidence. It does not replace explicit instruction or teacher observation.

The reusable Addition Fact Fluency Within 10 template is dist/addition-intervention.json. It leaves the student alias, baseline, baseline date, start date, goal date and observations blank. It proposes a Tier II small group of 3 to 5, about 10 minutes daily on 4 to 5 school days, initial review after 6 instructional weeks, and review of accuracy, efficiency and fact-map evidence every 2 weeks. Its scheduled assessment guidance is every 2 weeks for Tier II, with distinct-day confirmation checks near completion. These schedule, tier, attendance and fidelity expectations are template guidance, not automatically enforced calendar rules.

Addition uses all 66 ordered facts with whole-number addends including zero and sums at most 10. Subtraction uses a separate 66-fact bank with nonnegative answers. Multiplication and division have their own banks. The catalogs also provide Pre-K through Grade 5 skill checks, with standard codes and classification as fluency focus, skill check or local expectation. Grade 3 multiplication/division are labeled local expectations. Catalog coverage is a set of focused probes and is not certification of complete grade-level standards mastery.

Sources: dist/session.js (skills, bank), dist/skill-catalog.js, dist/prek-catalog.js, dist/addition-intervention.json, dist/teacher-notes.js.

## Exact current scored-check rules

1. All four game choices feed the same selected-skill history: Tiger Downs / Horse Race, Jet Ski, Subway Run and Sprint Car. Game choice does not create a separate mastery series.
2. A check records first answers. Corrected warm-up answers never replace a scored first response. Accuracy is correct first responses divided by the full configured item count, multiplied by 100.
3. The first 3 valid, current-protocol assessment checks form the baseline. All 3 can be on one day, or spread across days. Baseline is the median of the 3 accuracy percentages. A passing baseline result is still baseline and does not count toward the later passing streak.
4. After baseline, only the first valid matching assessment on each local calendar date is official. Later assessments on that date remain recorded as retakes and do not change the official chart or passing streak. A later same-day good score cannot replace that day's first low score.
5. Automatic completion requires a consecutive run of at least 3 official checks, each at or above 95 percent and within the configured active time limit, with at least 3 distinct form IDs in the passing run. Official selection makes these separate-day checks. A lower official score resets the current passing run.
6. Once completion has occurred, the skill remains checked off even if a later retention score is lower. The current passing streak can fall while the historical completion remains true. The class view explicitly supports a retention review after a lower score. Completion time is retained in the calculated summary.
7. Legacy results remain saved, but a result counts in the current comparison only when its protocol signature, item count, time limit and form ID match the current configuration. Source validation recalculates assessment correct counts and percentages from response records.
8. Leaving the page, hiding the tab, or changing the storage mode during an active check interrupts the check. An interrupted check is retained as invalid and excluded from baseline/completion calculations. A completed timed-out check pads remaining items with incorrect unanswered responses. The current uncompleted item is marked unanswered; later unseen items are also marked notPresented. Unseen items are excluded from instructional family evidence and coverage, but still lower the overall timed-check score.

Sources: dist/race-protocol.js overrides the earlier implementations in dist/session.js; dist/race-timer.js; dist/connected-game.js; dist/rosenbaum-bridge.js. Active HTML pages load session.js before race-protocol.js, so race-protocol.js is authoritative for check counts and summaries.

## Timing and forms

Protocol version is timed-balanced-v1. Configuration signature is version:skill:itemCount:seconds. Teachers and students cannot change these fixed public-pilot settings through the current race protocol UI.

| Skill configuration | Items | Active seconds | Correct needed for 95 percent |
| --- | ---: | ---: | ---: |
| Addition within 10, subtraction within 10, multiplication facts, division facts, 1.NR.2, 2.NR.2a, 4.FACT, 5.FACT | 30 | 90 | 29 |
| Pre-K and Kindergarten with place input | 30 | 300 | 29 |
| Other Pre-K and Kindergarten | 30 | 180 | 29 |
| 2.NR.2b | 20 | 240 | 19 |
| 3.PAR.2 | 20 | 360 | 19 |
| 4.NR.2 | 20 | 480 | 19 |
| 5.NR.2a and 5.NR.2b | 20 | 900 | 19 |
| Other catalog checks | 30 | 180 | 29 |

The timer measures active answering time and pauses for forced feedback or animation delays. It uses performance.now rather than calendar timestamps. Input can include typing, keypad tapping, choices or placing objects depending on the skill. Device input and hesitation affect response time. One-digit numeric answers submit immediately; multi-digit inputs generally submit after a 650 millisecond input pause or explicit Enter. Response time is adjusted to the last entry time so the auto-submit delay is not added to solving time. Game artwork/opponent movement does not determine an assessment score.

Basic-fact forms are deterministic rotating, family-balanced sets. For addition/subtraction within ten, A, B and C collectively cover the 66 ordered facts, with review facts filling each 30-item form. Larger fact banks can use more than 3 forms. Other catalog checks create 3 deterministic forms. Form selection rotates by the count of valid matching assessment records, including retakes. The blueprint records item counts by fact family. Balance and reproducibility are implemented; psychometric equivalence, norms and advanced/Pre-K timing benchmarks have not been established by this code.

Sources: dist/race-protocol.js, dist/race-timer.js, dist/item-ui.js, dist/connected-game.js, dist/rosenbaum-bridge.js.

## Automatic completion versus the fuller instructional decision

The automatic checkmark uses the timed-accuracy/day/form rules above. It does NOT gate completion on full-bank coverage, resolved recurring errors, a teacher efficiency observation, teaching fidelity or a scheduled retention check.

The reusable intervention template proposes a fuller fluency decision: three passing timed checks plus efficient recall or an efficient understood mental strategy observed on each, full-bank coverage and resolved recurring errors, followed by retention about 2 weeks later. Teachers must review those additional conditions outside the automatic checkmark. The site provides supporting evidence and free-text teaching notes, but no structured efficiency checklist, attendance/minutes tracker or automatic retention calendar is connected to the completion engine.

The template also proposes feedback after the entire assessment, while current games show immediate correctness feedback and award coins after correct first answers. They do not allow correction of that scored response. This difference should be resolved before treating the reusable template as a fidelity specification for formal implementation.

Sources: dist/addition-intervention.json, dist/race-protocol.js, dist/teacher-notes.js, dist/connected-game.js, dist/rosenbaum-bridge.js.

## Warm-ups and instruction

Warm-ups consist of 10 paced mental prompts with answers revealed, followed by 10 entered answer checks. Mental answers are unscored: mentalCorrect is null and mentalAccuracy is null. The entered phase retains each first response and separate retries. A student advances after a correct entered answer; errors remain in the first-response record. Warm-ups never count toward baseline, official checks or completion, and they do not earn assessment coins.

The warm-up plan examines the most recent 3 valid assessments for the selected skill, preferring actual played checks over simulated source records. It prioritizes up to 7 recently missed facts, then fills with mixed review. The chosen fact IDs, source attempt IDs and whether targeting was based on simulated records are retained. Stopped warm-ups are checkpointed and reported as interrupted. Pace settings are retained as instructional settings, not scored-check timing accommodations.

Teacher next moves use the most recent 4 official checks, prioritize the lowest-accuracy fact family, and identify up to 3 missed facts, recurrence by distinct dates, last incorrect response and expected answer. Guidance considers incomplete baseline, latest accuracy, passing progress, median correct first-response times, recent warm-up retries and coverage. Recommendations are possible teaching moves, not diagnoses of a misconception.

The fact-family heat map aggregates first-answer correct/total across the last 4 official checks. It excludes notPresented responses. Its color bands are 90 percent or above, 75 to 89, 60 to 74, 40 to 59, and under 40. A green family cell does not mean the skill is complete. Make 10 can be highlighted as 0 percent in the guided simulation because the related response evidence is deliberately simulated to match narration.

Sources: dist/session.js (warmupPlan), dist/warmup-engine.js, dist/warmup.js, dist/teacher-notes.js, dist/teacher-heatmap.js.

## Independent pathway and official teacher assignment

The pathway follows ordered catalog skills from the starting grade. Default enrolled grade is Grade 3. Enrolled Grade 2 or above starts at Grade 1 skills; Pre-K, Kindergarten and Grade 1 defaults start at Pre-K. The next independent step is the first uncompleted skill in that sequence. Completion automatically advances this independent next step.

The teacher-assigned intervention skill is a separate pathway.assignedSkill value. Independent checks can complete any skill but do not automatically change this assignment. The class demo has an explicit Assign this skill for intervention action and an intervention-context launch link. A race receives workContext=intervention only when launched with context=intervention and its selected skill matches the assigned skill. Otherwise it is independent. The attempt also retains enrolled grade and assigned skill at its start.

Changing enrolled grade through the class demo resets the pathway start grade and teacher assignment to the first skill at that starting level. It does not erase saved attempts. Public teacher controls are demonstration controls without staff authentication.

Source: dist/student-pathway.js, dist/dashboard.js, dist/demo-class.js.

## Retained data dictionary

Browser state has version, selected skill, attempts, profile, pathway, teacherNotes, classTeacherNotes, warmupPaces, stable and wallet, plus optional demo control/sample metadata. Invalid or malformed attempt entries may be retained in quarantinedAttempts. The current preview does not establish a district student ID or an authenticated staff ID.

| Entity | Stored fields and meaning |
| --- | --- |
| Assessment attempt | id (UUID), game, mode, skill, date (local YYYY-MM-DD), startedAt/completedAt (ISO timestamps), demo, storageKey, items, responses, itemCount, correct, percent, activeMs, finished, valid, passed, unanswered, timedOut/interrupted when applicable, formVersion, protocolVersion, protocolSignature, timeLimitSec, formId, formCycle, blueprint, studentGrade, assignedSkillAtStart, workContext; optional source, phase and opponent data for simulations or horse pacing |
| Item | id, prompt, expected value in answer, fact operands when applicable, skill/subskill, visual/input descriptors and optional choices |
| Assessment response | itemId, prompt, expected, response, subskill, correct, rtMs; optional responseMethod, coinEarned, unanswered, notPresented. responseMethod is populated in the connected non-horse games but is not consistently stored in the horse adapter |
| Warm-up | id, storageKey, demo, game, skill, mode=warmup, date, startedAt, completedAt, version, formVersion, focus (targetedIds, sourceAttemptIds, simulated), paceSec, pacedItems, items, paced, responses, retries, typedIndex, correct, percent, activeMs, valid, finished, status, mentalAccuracy=null |
| Mental exposure | itemId, prompt, expected, paceSec, exposureMs, answerViewMs, mentalCorrect=null |
| Entered warm-up response/retry | itemIndex, itemId, prompt, expected, response, subskill, correct, rtMs, responseMethod, at |
| Teacher note | id, date, text, recommendationRules, evidence (the generated rules), facts (prompt, family, distinct miss dates and last response), generatedAt, recordedAt. Notes are free text with an evidence snapshot, rather than a scored observation rubric |
| Pathway | version, startGrade, assignedSkill, assignedAt, completionNotices; profile holds grade |
| Rewards | wallet balance/earned/events/coinLog/transactions/owned/equipped; stable racer look and equipment. One assessment coin per correct response, deduplicated by attempt ID and response index. Synthetic sample/demo reward events are excluded from spendable earnings |

Some properties exist only after an action, differ between adapters, or are simulation metadata. Do not assume every attempt contains every optional field. JavaScript functions are omitted when records are serialized to JSON. Assessment validity is recalculated on read from full response count and a nonnegative finite activeMs, and protocol eligibility is separately checked for summaries.

Sources: dist/session.js, dist/race-protocol.js, dist/student-pathway.js, dist/warmup-engine.js, dist/teacher-notes.js, dist/rosenbaum-bridge.js, dist/connected-game.js, dist/store-engine.js.

## Reports and export

Student reports provide a skill matrix, the independent next step and teacher focus, official score chart, median baseline, latest score, passing status, item review, median correct first-response time, elapsed seconds, unanswered counts, fact-set detail, retake flags and warm-up history/details. All four races share this report. Legacy settings are identified as excluded from the current comparison. Retakes remain in detailed history. Family-report rendering is inherited and adapted to check terminology. Teacher efficiency/flexibility observation entry is removed from the public student report with a note that it will be added through the MTSS platform.

The legacy renderer includes CSV helpers with columns: date, friday, school, grade, teacher, class_code, student, student_id, standard_set, standard_codes, correct, incorrect, no_response, not_heard, total, seconds, correct_per_min, median_rt, mode, page_exits, fact_set_detail. It also contains eduCLIMBER export and communication-preview scaffolding from the original application. Those source functions are not evidence of a working district integration in this public build. The current preview's identity adapter uses preview-student, sample teacher metadata and empty class code. A legacy friday column derives a week label rather than changing the daily official-check rule. No complete first-response JSON export button is provided in the current public UI as a normal handoff integration.

When storage fails, the alert allows a JSON recovery download containing pending state and saved raw normal/demo storage strings. This recovery file is broader than an analysis CSV and may include notes and cosmetics. Recovery is a local troubleshooting mechanism, not an automatic cloud backup or import pipeline.

Sources: dist/reports.js, dist/rosenbaum.js (attemptRows, ecRows, exportCsv), dist/rosenbaum-bridge.js, dist/storage-health.js, dist/session.js.

## Demo, walkthrough and storage boundaries

- Normal browser progress is under localStorage key pathway_arcade_student_v1.
- Isolated connected demo progress is under pathway_arcade_demo_v1, selected by pathway_arcade_demo_enabled.
- Guided walkthrough data uses sessionStorage pathway_guided_state while pathway_guided_active is set and the page/frame is under walkthrough. It is temporary scripted demonstration evidence, not a roster import.
- The public homepage does not enable demo automatically for a fresh browser. Fresh visitors see Explorer, Grade 3, Addition within 10 and no checks, with demo and guided walkthrough options. Returning browsers remember mode and history, explaining different entry screens or progress states.
- The class screen switches to demo storage. Jordan Carter is a connected demo identity whose real interactions in demo mode update that demo history. Other classmate names and scores are generated sample fixtures. Those classmates do not have underlying collected item responses or observed strategies. Their heatmap can therefore be empty, and skill-level guidance is explicitly labeled as illustrative.
- The guided audio and graphs intentionally use simulated dates and results, with labels explaining compressed later days. Gold highlights and horizontal scrolling synchronize the visual target with narration. These scripted controls are isolated from ordinary browser progress.

Data persistence is local to the browser profile and device. There is no verified multi-user roster, login, school tenancy, cloud database, cross-device synchronization, server audit trail, automatic district backup or production SIS identity mapping. Publicly hosted code/assets are accessible, but ordinary progress is saved locally. Browser clearing/private sessions or a new device can lose or isolate local history. Concurrent-tab writes are guarded against overwriting changed state, and recovery alerts preserve unsaved work.

Sources: dist/session.js, dist/demo-samples.js, dist/connected-demo.js, dist/demo-class.js, dist/walkthrough.js, dist/podcast-cue-player.js, dist/storage-health.js. dist/rosenbaum.js sets SERVER=false; its Apps Script branches are dormant in this public build.

## Integration handoff and remaining requirements

The current reusable template names a future import contract: district student ID, assigned monitor ID, attempt ID, operation, form version, date/time, first responses and timing, with deduplication by attempt and exclusion of practice. These identifiers and services are not fully implemented in the browser preview. An implementation team should preserve attempt identity, original first responses, protocol metadata and separate assessment/practice modes; preserve official versus retake status; and recompute completion with the same baseline/day/form/time rules rather than importing an unexplained checkmark.

Before operational deployment, decide and validate: authentication and roster ownership; district student/monitor identifiers; server persistence and backup; allowed assessment accommodations and their comparison rules; form equivalence and timing decisions; staff fidelity/attendance and structured efficiency records; retention scheduling; formal completion and tier-decision policy; approved export schema and units; integration validation and deduplication; privacy/access controls and record retention. These are concrete missing or manually reviewed capabilities, not features already provided by the public demonstration.

The public build's accuracy checkmark, guidance and local storage should be explained exactly as above. Full standard mastery, diagnostic findings, formal tier exit, automated eduCLIMBER submission and live IXL/MTSS exchange cannot be inferred from this source.
