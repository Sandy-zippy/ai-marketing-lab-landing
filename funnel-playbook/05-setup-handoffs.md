# Setup handoffs (need Sandy's accounts)

These three need credentials only Sandy has. Everything else is wired and ready. Each is a short, one-sitting task.

## A. Meta Pixel (code is live, dormant)

The pixel snippet + event mapping is already in `index.html` and `thank-you.html`, gated on a placeholder.
- Events mapped: `quiz_started` to InitiateCheckout, `scorecard_submitted` to Lead, `thankyou_view` to CompleteRegistration, `1on1_inquiry_submitted` to SubmitApplication.
- **To activate:** create (or pick) an AIML Meta pixel in Events Manager, copy the pixel ID, and replace `REPLACE_WITH_AIML_PIXEL_ID` in BOTH files (`META_PIXEL_ID`). Commit + push. Retargeting audiences start filling immediately, before any spend.
- A ZippyScale pixel exists (`961643772929674`) but use a separate AIML pixel so audiences do not mix.
- Server-side CAPI (for dedup + iOS) can reuse the n8n pattern from the zippyscale-meta-capi memory later; browser pixel is enough to start building audiences.

## B. lead-notify.gs (built, needs deploy)

See `README-lead-capture.md`. 5-minute deploy: paste `lead-notify.gs` onto a Google Sheet, Deploy as Web app (Execute as Me, Anyone), authorize, copy the `/exec` URL into `LEAD_WEBHOOK` in `index.html` + `thank-you.html`, push. Turns on: lead alerts to your inbox, full data capture (agent + 1-on-1 message), and the optional build-plan auto-responder (flip `SEND_RESULT_EMAIL = true`).

## C. ManyChat comment-to-DM-to-quiz bridge

The missing pipe between IG content and the funnel. Free tier covers launch volume.
1. Create a ManyChat account, connect the @sandymarketinglab Instagram (needs IG connected to a Facebook page; the account must be a Professional/Creator account).
2. New Automation, trigger: **Instagram, comment on a post/reel contains keyword.** Use one keyword per reel theme (e.g. `AGENT`, `BUILD`, `LEADS`).
3. Action: send a DM. Message: a one-line value hook + the quiz link with UTMs, e.g. `https://aimarketinglabs.in/?utm_source=ig&utm_medium=comment&utm_content=<reel-slug>`.
4. Add a reply-comment step ("Sent you a DM") so the comment thread shows social proof.
5. Optional: capture the DM opt-in for WhatsApp/email if ManyChat is later connected to the list.
- Per reel, put the keyword in the caption and say it out loud in the hook ("comment AGENT and I'll DM you the scorecard").

## D. Beehiiv (email tool)

1. Sign up at beehiiv.com (free to 2,500 subscribers).
2. Create the publication "AI Marketing Labs" (or the operator letter brand).
3. Import the current Google Sheet leads as subscribers; create tags matching the scorecard segments (`quiz-lead`, `quiz-followup`, `quiz-content`, `quiz-campaign`, `quiz-orchestrator`) + `waitlist-founding-cohort`.
4. Paste the 9-email flow (`03-email-flow.md`) as an automation triggered on subscribe, with the `{{recommended_agent}}` + `{{why}}` merge from the tag.
5. Ongoing sync: an n8n cron on the Mac Mini watches the leads Sheet and upserts new rows into Beehiiv with the segment tag (build after the manual import proves the flow).
- Until Beehiiv is live, the auto-responder in `lead-notify.gs` (item B) covers the immediate welcome email.
