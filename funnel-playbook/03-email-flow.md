# AI Marketing Labs: Post-Quiz Email Nurture Flow

Trigger: scorecard quiz completed, contact created with quiz result. All emails from "Sandy Kadyan, AI Marketing Labs" (reply-to live). Plain, single-column, no heavy design. No em dashes anywhere. Most emails under 150 words, one CTA each (almost always "reply", which doubles as engagement scoring).

## Email 0: Welcome + Build Plan (send immediately)

Purpose: deliver the quiz-result value, set waitlist expectations, one next step (reply).
Subject: Your build plan: the {{recommended_agent}}
Preview: Here is what to build first, and why.

Body (template):

Hey {{first_name}},

You took the scorecard, so here is your answer straight up.

Build first: the {{recommended_agent}}.

{{why}}

That is the whole logic. One agent, on your real work, doing one job well. Not 14 ChatGPT tabs.

Two things you should know:
1. You are on the founding cohort waitlist. 6 weeks, one live build a week, you build all 6 agents on your own marketing and keep them. Built on Claude Code, Composio, Mem0, n8n.
2. Pricing and dates go to this waitlist first, before they appear anywhere public. Seats are capped at 100 and 37 are taken.

One thing I would love from you: hit reply and tell me what marketing task eats most of your week. I read every reply, and it shapes what we build live.

Sandy

{{why}} merge block, example filled for the Follow-up Agent:
> Your answers say leads are not your problem. What happens after the lead is. Enquiries come in, you reply to the first few fast, then the rest go cold in a spreadsheet or a WhatsApp scroll. A Follow-up Agent watches every open conversation, drafts the next touch in your tone, and never forgets on day 4 like a human does. For most marketers this is the highest-ROI agent because the leads already exist. You paid for them once. This agent stops you paying twice.

(Write one {{why}} paragraph per result: Lead, Follow-up, Content, Campaign, Orchestrator. Same shape: their symptom, what the agent does, why it is first for them.)

## Email 1: Day 2, Value

Subject: Why your ChatGPT prompts don't survive Tuesday
Preview: The difference between a prompt and an agent, in plain words.

Hey {{first_name}},

Most marketers use AI the same way: open ChatGPT, paste context, get output, close tab. Next day, start from zero.

That is a prompt. It has no memory, no tools, no schedule.

An agent is three upgrades:
1. Memory. It remembers your offers, tone, past campaigns (we use Mem0 for this).
2. Hands. It can actually touch your tools: sheets, email, ads, CRM (Composio).
3. A clock. It runs on schedule without you (n8n).

Prompt = an intern with amnesia. Agent = a team member who shows up daily.

Quick test: pick one task you prompted AI for this week. Ask yourself what it would need to do that task without you tomorrow. That gap is your build list.

More on your {{recommended_agent}} in the next email.

Sandy

## Email 2: Day 4, Value + Proof

Subject: My marketing ran this morning without me
Preview: What my own agent fleet did before 10am, exactly.

Hey {{first_name}},

I build in public, so here is mine.

Every morning my Orchestrator agent kicks off the fleet:
- 9:00: it dispatches the day's tasks to the other agents
- 9:05: performance agent audits Meta and Google accounts and flags anything odd
- 14:00: outreach agent drafts follow-ups for open conversations
- 16:00: content agent preps the day's posts for three channels
- 22:00: the performance agent queues tomorrow's creative tests

I review and approve. I do not execute.

Nothing here is a demo built for a screenshot. It is the same stack you would build in the cohort: Claude Code, Composio, Mem0, n8n. Week 6 is literally this Orchestrator.

I am not claiming numbers. I am showing you my calendar. That is the honest pitch.

Sandy

## Email 3: Day 7, Value + Objection ("I'm not technical")

Subject: "But I can't code"
Preview: You don't need to. You need to be able to describe your work.

Hey {{first_name}},

Most common reply I get: "This sounds great but I'm not technical."

Here is the actual skill the cohort requires: describing your marketing process precisely. That is it.

Claude Code writes the code. Composio handles the tool connections. n8n gives you a visual canvas. Your job is the part no tool can do: knowing what a good lead looks like, what your follow-up cadence should be, what on-brand sounds like.

Marketers are better at building marketing agents than developers are. A developer builds a technically perfect agent that sends terrible follow-ups. You will build a slightly scrappy agent that sounds like you. The second one makes money.

Try it now: write 5 numbered steps for how you handle a new lead today. If you can do that, you can build the agent. That document is homework for week 1 anyway.

Sandy

## Email 4: Day 10, Cohort Introduction

Subject: The founding cohort, properly explained
Preview: 6 weeks, 6 agents, built on your work, yours to keep.

Hey {{first_name}},

You have had the ideas. Here is the room where you build them.

The founding cohort:
- 6 weeks, one live build session a week
- You build on YOUR business, not a sample project
- Week 1: your marketing OS foundation (memory, brand, data)
- Weeks 2 to 5: Lead, Follow-up, Content, Campaign agents
- Week 6: the Orchestrator that runs them all
- Stack: Claude Code, Composio, Mem0, n8n
- You keep every agent. No platform fee to me, ever. They are yours.

Founding cohort means you get me live, you shape the curriculum, and you pay less than any future cohort will.

Seats: capped at 100, 37 taken. Pricing and dates go to this waitlist before anywhere else.

You do not need to do anything today. When pricing drops, you will be first to know. If you have a question, reply. I answer all of them.

Sandy

## Email 5: Day 13, 1-on-1 Done-For-You

Subject: If you'd rather skip the building part
Preview: For a few businesses, we build the entire system for you.

Hey {{first_name}},

The cohort is for people who want to build. Not everyone should.

If you are running a business where your hour is worth more spent selling than building, there is a second door: 1-on-1 done-for-you.

We build your entire AI marketing system end to end. Same six agents, same stack, but my team and I do the building, on your accounts, tuned to your process. You get the working system plus the handover so your team can run it.

This is right for you if:
- You have real lead flow already and follow-up is leaking
- You want the outcome, not the skill
- You can give us a few hours of input calls, not six weeks

I take very few of these because each one gets real attention.

Interested? Reply with "1-on-1" and two lines about your business. I will tell you honestly if it is a fit.

Sandy

## Email 6: Day 16, Objection Sweep + Value

Subject: Three doubts, answered straight
Preview: Time, tool churn, and money. The honest answers.

Hey {{first_name}},

The three doubts I hear most, answered without spin:

"I don't have 6 weeks." It is one live session a week plus 2 to 3 hours of applying it to your own work. If you cannot find that, you need the Follow-up Agent more than anyone, or the 1-on-1 route.

"AI tools change every month." Models change. Your process does not. The cohort teaches you to encode YOUR process, with the model as a swappable part. That skill compounds while tools churn.

"What does it cost?" Pricing goes to this waitlist first, and founding cohort pricing will be the lowest it will ever be. I will not pretend it is cheap. It is priced for people who will use it on a real business.

Still on the fence? Reply with your doubt. The unanswered ones are the dangerous ones.

Sandy

## Email 7: Day 19, Oversubscribed Close

Subject: Seats update, and what happens next
Preview: Where the 100 seats stand, and how pricing drops.

Hey {{first_name}},

Straight update on the founding cohort.

The cap is 100 seats. More than a third are already committed, and the waitlist behind you is bigger than the seats that remain. I am not going to invent a countdown timer. Here is what is actually true:
1. Pricing and dates go to this waitlist first, in order.
2. When they drop, seats fill on first come, first served.
3. When 100 is hit, the founding cohort closes. The next one will cost more and will not carry the "shape the curriculum" seat you get as a founder.

If you already know you are in, reply "IN" and I will flag you for first access when pricing goes out.

If you would rather we build it for you, reply "1-on-1" instead.

Either way, keep building your process doc from week 1 homework. It is useful even if you never buy a thing from me.

Sandy

## Email 8: Day 22, Soft Wrap (optional, non-repliers only)

Subject: Last one from me for a while
Preview: One question before I slow down these emails.

Hey {{first_name}},

I will stop emailing this often. One question first.

Which is true for you right now?
A. I want in the cohort, waiting on pricing. (Reply "A")
B. I want the done-for-you build. (Reply "B")
C. Interested, wrong timing. (Reply "C")
D. Just here for the free stuff. (Reply "D", genuinely fine)

Whatever the letter, you stay on the list for pricing-first access and the build-in-public updates. A and B replies get personal follow-up from me this week.

Thanks for reading these. Building this thing in public is more fun with you watching.

Sandy

## Branching: hot 1-on-1 lead vs cohort waitlist lead

Cohort-waitlist lead (default): runs the full flow above, Emails 0 through 8.

Hot 1-on-1 lead (replied "1-on-1"/"B", clicked the done-for-you section twice, or asked about pricing for done-for-you):
- Immediately exit the automated sequence. Tag dfy-hot.
- Sandy sends a personal reply within 24 hours: 2 qualifying questions then a call link. No automation voice, no drip.
- If they book: sequence stays off, sales pipeline takes over.
- If they go quiet 5 days after the personal reply: one manual nudge, then re-enter the flow at Email 6.
- Never send a hot lead Emails 4 and 7 (cohort scarcity) while a 1-on-1 conversation is open.

Any reply at all pauses automation for 48 hours so Sandy's personal response lands alone, then resumes at the next unsent email.

## Segmentation + tagging

On quiz completion (source of truth = quiz result): quiz-lead / quiz-followup / quiz-content / quiz-campaign / quiz-orchestrator (drives the merge + future segment sends); waitlist-founding-cohort (everyone); source-scorecard + UTM tags (src-ig, src-ads, src-referral).

Behavior tags during the flow: engaged-hot (replied or clicked in 3+ emails, priority for pricing-drop first wave); engaged-warm (opened 3+, no reply); dormant (no opens by Email 5, send only 7 and 8 then monthly digest); dfy-hot (any 1-on-1 signal, exits drip); cohort-committed (replied "IN"/"A", first names on the pricing email); timing-later (replied "C", monthly digest, re-invite next cohort); content-only (replied "D", monthly digest only, never scarcity).

Pricing-drop send order (Priestley oversubscription): cohort-committed first (few hours head start), then engaged-hot, then engaged-warm, then dormant. Announce publicly only after the waitlist has had its window.

Note: all scarcity claims use only real facts (100 cap, 37 taken, waitlist-first pricing, no fake deadline). No fabricated revenue numbers anywhere.
