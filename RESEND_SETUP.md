# Email setup (Resend)

The checkout, contact, and newsletter forms send email server-side via
[Resend](https://resend.com) instead of `mailto:` links. This needs two
environment variables set — locally in `.env.local` (gitignored, never
commit real keys) and in Vercel's project settings for production.

## 1. Get an API key

1. Sign up at resend.com and create an API key.
2. Set `RESEND_API_KEY=re_...` in `.env.local` (local dev) and in
   Vercel → Project Settings → Environment Variables (production).

Without this set, the forms fail with a real, visible error
("RESEND_API_KEY is not configured") instead of silently pretending to
succeed — that's intentional, not a bug to work around.

## 2. Verify your sending domain (required for real production use)

Until `containeronedepot.com` is verified in Resend, you're restricted to
their shared `onboarding@resend.dev` sender, which Resend only allows
sending to **the email address you signed up to Resend with** — not
customers, not `contact@containeronedepot.com` unless that happens to be
your Resend account email. This is Resend's anti-abuse restriction, not
a bug here.

To send real customer-facing email from your own domain:

1. In Resend, add `containeronedepot.com` as a sending domain.
2. Add the DNS records Resend gives you (SPF/TXT + DKIM/CNAME) at your
   domain registrar.
3. Wait for verification (usually minutes, sometimes longer for DNS
   propagation).
4. Set `RESEND_FROM_EMAIL=noreply@containeronedepot.com` (or whatever
   address on the verified domain you want to send as).

## 3. Test it

Fill out the contact form (or a trial checkout) and confirm the email
actually arrives in `contact@containeronedepot.com`. If it fails, the
error message returned to the browser includes Resend's actual API
error — check that first before assuming it's a code issue.
