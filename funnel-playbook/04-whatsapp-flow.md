# AI Marketing Labs: WhatsApp Waitlist Flow

Trigger: scorecard quiz completed, name/email/WhatsApp captured, thank-you page shown. This flow starts within 10 minutes of opt-in and runs alongside email. Personalization tokens: {name}, {agent} (their quiz result: Lead / Follow-up / Content / Campaign / Orchestrator).

## 1. Opening message

When: 5-10 min after quiz completion, any time 8am-9:30pm IST. Outside that window, hold until 9am next day.
Type: pre-approved WABA utility template (see compliance).
Goal: confirm waitlist, deliver one bite of their build plan, prove a human is on the other end, get a reply.

> Hey {name}, Sandy here from AI Marketing Labs
> You're on the waitlist. Your scorecard says your first build should be the {agent} agent, and honestly the quiz got that right more often than I expected when I built it.
> Quick one so I send you the right stuff: are you running this for your own business, for clients, or for the company you work at?
> Just reply with one word. This is my actual WhatsApp, not a bot blast.

Why the question: opens the 24-hour session window, segments them (founder / agency / in-house), starts a real thread Sandy can work.

## 2. Value + conversion sequence

Day 0 = quiz day. IST times noted (India-first); map to local time globally where the tool allows.

**Message 2 - Quick win for their agent. Day 2, ~11am IST.**
Media: 60-90 sec screen-recording clip of the {agent} agent doing one real task (rotate 5 clips, one per agent type).
> {name}, before anything else, here's the fastest version of your {agent} agent.
> You don't need code for v1. Open Claude, paste your last 10 leads/posts/follow-ups (whatever {agent} touches), and ask it to find the pattern you keep repeating. That pattern is your agent's first job.
> Sending a short clip of mine doing exactly this
> Try it on your own work this week. Takes 15 min.

**Message 3 - Build-in-public proof. Day 5, ~7pm IST.**
Media: voice note (45-60 sec) from Sandy, casual, one take. Alt: photo of the n8n canvas or Claude Code terminal.
> Voice note incoming, 50 seconds
> [Voice note: "Hey, Sandy here. Quick behind-the-scenes. This week I've been wiring the follow-up agent to memory using Mem0, so it actually remembers what a lead said three conversations ago. Took me two evenings and one very annoying auth bug. I'm posting the whole build on @sandymarketinglab if you want to watch it come together. Nothing to buy here, just wanted to show you this stuff is real and buildable."]
> Full build breakdowns are on @sandymarketinglab if you want to follow along.

**Message 4 - Soft cohort intro + reply prompt. Day 8, ~12:30pm IST.**
> {name}, small update. The founding cohort is taking shape.
> 6 weeks, one live build a week. You build your own agents on your own work and keep all of them: marketing OS foundation, then Lead, Follow-up, Content, Campaign, and the Orchestrator that runs them together.
> Not selling seats yet. Just want to know: if you joined, which part of your marketing would you want an agent to take off your plate first?
> Reply and tell me. It genuinely shapes what I build into the live sessions.

**Message 5 - The pricing question, answered the waitlist way. Day 11, ~10am IST.**
> A few people have asked what the cohort costs.
> Honest answer: pricing goes to this waitlist first, before it appears anywhere public. You'll see the number and get first right to a seat before anyone else does.
> Doing it this way because 100 seats is the cap for the founding batch and I'd rather fill it with people who took the scorecard than run ads for it.
> If price is the deciding factor for you, reply "price" and you'll be first in line when it drops.

**Message 6 - 1-on-1 done-for-you, for high intent. Day 14, ~6pm IST.**
> One more thing that's been coming up in replies.
> Some of you don't want to learn to build. You want the whole system built for you: agents, workflows, memory, the lot, wired into your actual business end to end.
> I take a very small number of those 1-on-1 projects because I build them myself.
> If that's more your speed than the cohort, reply "DFY" and I'll ask you 3 quick questions to see if it's a fit. No call needed to find out.

**Message 7 - Oversubscribed nudge. Day 17, ~11am IST.**
> Waitlist update: 37 of the 100 founding seats are spoken for through waitlist requests, and pricing hasn't even gone out yet.
> When it does, it comes here first and seats go in order of reply.
> Nothing to do right now. Just didn't want you finding out after the fact.

**Message 8 - Re-engagement for quiet leads. Day 21, ~7:30pm IST. Send ONLY to contacts with zero replies.**
> {name}, you took the scorecard 3 weeks ago and got {agent} as your first build. Haven't heard from you since, which is fine, life's busy.
> One question and then I'll leave it: what stopped you? Wrong timing, wrong result, or just watching for now?
> Any answer helps me, even "not for me". And if you'd rather I stop messaging, reply STOP and that's done, no hard feelings.

After Day 21: quiet leads drop to announcement-only (pricing drop, doors open, doors close). No more nurture.

## 3. Conversation branches

"How much is it?" / "Price?"
> Fair question. The number goes to the waitlist first, before it's public anywhere, and you're on it.
> What I can tell you now: it's priced for operators, not enterprise, and founding cohort pricing won't repeat for later batches.
> So I pitch it right when it drops: are you weighing this against courses, against hiring, or against your own time?

"I want the done-for-you"
> Good. Three questions, answer in one message if you like:
> 1. What does your business sell and to whom?
> 2. Where does marketing break first for you right now: leads, follow-up, or content?
> 3. Are you the decision maker on this?
> If it looks like a fit I'll send you exactly what the build covers and what it costs. If it doesn't, I'll tell you that too and point you at the cohort instead.

"Not sure it's for me" / "I'm not technical"
> Totally fair, and you're not alone. Roughly half the waitlist has never touched an automation tool.
> The cohort is built for marketers, not engineers. Live sessions, you build on your own work, and if you get stuck I'm in the room. You leave with agents you own, not a certificate.
> What's the real hesitation though: the tech, the time, or whether agents can actually do YOUR kind of work? Tell me and I'll give you a straight answer.

"When does it start?"
> No fixed date announced yet. The founding cohort starts once seats fill, and pricing plus dates go to this waitlist first.
> Realistic prep if you want a head start: try the 15-min exercise I sent earlier on your {agent} agent. People who show up having done that get the most out of week 1.
> Want me to ping you the moment dates are locked? Reply "dates".

"STOP" / opt-out
> Done, you won't hear from me here again. Scorecard result stays yours, and the build-in-public series is on @sandymarketinglab anytime. All the best.

(Then actually suppress them.)

## 4. Compliance and hygiene

Opt-in framing: the quiz form must say explicitly "I agree to receive my results and updates from AI Marketing Labs on WhatsApp." Checkbox, not pre-ticked. Store the timestamp. Message 1 references the scorecard immediately so context is obvious. Never open cold.

Template vs session messages (WABA rules):
- A form fill does NOT open a 24-hour session window. Only an inbound message from the user does.
- Every scheduled message (Messages 1-8) must be a pre-approved template UNLESS the contact replied within the last 24 hours.
- Message 1: submit as a Utility template (transactional: waitlist confirmation + quiz result). Better deliverability and lower cost than Marketing.
- Messages 2-8: submit as Marketing templates with {{1}} variables for name/agent so one approval covers all sends.
- All branch replies (Section 3) are session messages: free-form, no approval needed, because the user just messaged you. This is where Sandy's real voice lives; keep templates minimal and push conversation into sessions.
- Practical pattern: if a lead replies to Message 1, you can send Message 2 free-form inside that window. Prefer session sends when a window is open, template sends otherwise.

Frequency caps: max 1 business-initiated message per 2-3 days (this flow averages 1 per 3 days). Never two templates in a row without a reply in between, except the Day 21 re-engagement. Quiet hours: nothing before 8am or after 9:30pm recipient local time. Watch Meta's per-user marketing template limits; low read rates = pause that contact, do not push harder.

Opt-out: honor STOP, UNSUBSCRIBE, "stop messaging" and equivalents (including Hindi/Hinglish like "band karo") instantly and permanently for marketing sends. Mention opt-out once, in the re-engagement message, not every message. Blocks and reports hurt quality rating; if it drops to Medium, halve frequency immediately.

Hygiene: every reply gets a human (or Sandy-voiced) response within a few hours during the day. The whole flow's promise is "real human"; a 2-day silence after they reply breaks it. Segment from Message 1's reply and adjust examples in later sessions. No pricing, no revenue claims, no "students made X" anywhere until there are named, consenting case studies.
