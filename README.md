# The Ready for School Experience — landing page

A one-page static site for **The Ready for School Experience**, a signature confidence, etiquette and
character programme by Manners on Point School of Etiquette (children aged 9–15, East Legon, Accra).

Built to match `inspo.jpeg`, with all copy taken from
`The_Ready_for_School_Experience_Website_Copy_Developer_Brief_v2.1.docx`.

## Running it

Open `index.html` in a browser. That's it — no build step, no dependencies, no server required.

```
index.html                 all markup + the inline SVG icon sprite
assets/css/styles.css      design tokens, components, responsive rules
assets/js/main.js          sticky nav, drawer, scroll reveal, JotForm auto-resize
assets/img/                8 photographs + 3 logo files
jotform-custom-css.css     paste-into-JotForm styling (NOT loaded by the site)
```

External requests: Google Fonts (Poppins + Inter) and the embedded JotForm. Everything else is local.

## ⚠️ Before this goes live

### 1. Add the social links

The three footer social icons are the only remaining `href="#"` placeholders — add the real profile
URLs. Clicking them currently does nothing (they're prevented from jumping to the top of the page).

### 2. Confirm the placeholder content

| Item | Status |
|---|---|
| Phone `+233 24 123 4567` | From the mockup and looks like a dummy number — **verify** |
| The three testimonials | The brief says only *"Insert three authentic testimonials"*; the mockup's three names are used as-is — **confirm these are real and cleared for use** |
| Social links | All three point at `#` — add the real profile URLs |
| Trainer bio (4 paragraphs) | Taken from the mockup; the brief only supplies *"Certified Etiquette Consultant and Elocutionist."* Facts match the brief (8,000+ lives, 20+ organisations) |
| Contact address / email / website | From the mockup, not the brief — verify |

## Registration and payment

Everything happens on the page. The `#register` section at the bottom holds **step 1 (the embedded
JotForm)** and **step 2 (the payment card)**, side by side on desktop and stacked in that order on
mobile.

Nothing navigates away except the payment hand-off:

| Link | Goes to | Count |
|---|---|---|
| Reserve Your Child's Place | `#register` — scrolls down the page | 5 (header, snapshot, journey, closing band, mobile bar) |
| Make a Payment | `#payment` — scrolls to the payment card | 2 (Investment card, closing band) |
| **Pay with Paystack** | `https://paystack.com/pay/d53mhkvkh4` — new tab | 1 |
| Open the form in a new tab | the JotForm — new tab, fallback only | 1 |

The two-step order is reinforced in four places: the numbered `1 → 2` list under the main Reserve
button, the ordering of the two panels, the numbered step headings, and *"Register first, then pay to
confirm your child's place"* in the closing band.

### Why the form embeds but Paystack doesn't

I tested both in a real browser rather than assuming:

- **JotForm sends no framing restriction**, so it embeds cleanly. The iframe reports its height back
  (`setHeight:3400:203414478493561`) and `main.js` grows the iframe to match, so there's no
  scrollbar-inside-a-scrollbar. The message listener only trusts `*.jotform.com` origins, and if the
  message never arrives the CSS height stands so the form still works.
- **Paystack sends `X-Frame-Options: SAMEORIGIN`.** Framing it is refused by the browser — it renders
  as an empty grey box. That's deliberate anti-clickjacking on a payment page and not something to
  work around. So step 2 is an on-brand card that hands off in a new tab.

If you want payment to happen without leaving the page, the supported route is **Paystack Inline**
(`js.paystack.co`), which opens Paystack's own modal over the site. That needs your public key
(`pk_live_…`) plus a server endpoint to verify each transaction — send me the key and where
verification should live and I can wire it up. It can't be done from a payment link alone.

Also worth knowing: the Paystack link is a **fixed-amount** page, so it can't carry the child's name
or a registration reference, and it may not suit the deposit option the copy promises. Reconcile
payments against JotForm submissions manually, or move to an integration.

### Making the form look like the site

The form is in a cross-origin iframe, so **`assets/css/styles.css` cannot reach inside it** — no
stylesheet on this site can. Out of the box it renders in JotForm's own navy-and-grey theme, which
doesn't match.

The fix is **`jotform-custom-css.css`** in this folder. It's not loaded by the website and can't be —
it's meant to be pasted into JotForm: *Form Builder → Form Designer (paint-roller icon) → Styles →
Inject Custom CSS*. It restyles labels, inputs, focus rings, error states and the submit button to
the site's exact burgundy/gold tokens, and hides the form's own header block since the page already
prints a heading and your logo right above the embed.

Two things only you can change, inside JotForm:

- The form currently reports a height of about **3400px**, which is long. Shortening it, or switching
  it to JotForm's Card layout (one question at a time), would tighten the page considerably.
- On JotForm's free plan a **"Create your own Jotform"** banner appears at the bottom of the form.
  Removing it requires a paid plan; don't try to hide it with CSS.

## Logo

Your `logo.png` had ~250px of transparent padding on the left and 75px on top, which makes CSS sizing
unpredictable, so I generated two trimmed variants from it and left your original untouched:

| File | Size | Used for |
|---|---|---|
| `logo.png` | 1922×582 | Your original — untouched, not referenced by the page |
| `logo-lockup.png` | 1427×431 | Header (48px tall) and footer (52px). Full lockup including "School of Etiquette" |
| `logo-mark.png` | 647×346 | The "m" + gold dot. Watermark on the closing band, and the browser-tab favicon |

The lockup keeps the tagline rather than cropping it, so the header shows the complete mark as the
mockup intended. At 48px tall "SCHOOL OF ETIQUETTE" renders around 6.5px — small but legible, and
close to what the mockup itself showed. If you'd rather it be bigger, the standard fix is a
tagline-free header variant; say the word and I'll cut one.

**The logo's brand colours differ from the mockup's**, which is worth a decision:

| | Logo | Page (from `inspo.jpeg`) |
|---|---|---|
| Burgundy | `#981A36` | `#6B1029` |
| Gold | `#FECD08` (bright yellow) | `#C9A469` (antique) |

I kept the page on the mockup's deeper, more muted palette, since that's the design you asked me to
match — and the logo's bright `#FECD08` would fail contrast badly as a UI colour. The logo sits on
cream in both places, so the slight burgundy difference reads as normal logo-versus-brand variance.
If you'd rather the whole page retune to the logo's actual colours, that's a two-token change and I
can do it.

## Photographs

**Every photo on the site is now real Manners on Point photography.** Nothing is cropped from the
mockup any more, and no stock imagery is used.

The originals live alongside the crops and are not referenced by the page. Keep them; they're the
source if anything needs re-cropping:

| Original | Size | Used for |
|---|---|---|
| `children1.jpg` | 1280×853 | Hero + 2 gallery crops — "The Refined & Confident Girl" boardroom session |
| `children3.jpeg` | 6240×4160 | 1 gallery crop — the necktie-tying session |
| `newchildren.jpeg` | 6240×4160 | Why section — full group indoors with the branded banner |
| `newchildren2.jpeg` | 6240×4160 | 1 gallery crop — handshake demo, "Making Good First Impressions" |
| `newchildren3.jpeg` | 3480×1632 | 1 gallery crop — "Speech Structure & Practical Presentation" |
| `trainer.png` | 1002×1402 | The trainer portrait |

**The outdoor Summer Camp images have been removed** at your request, along with the poster they came
from (`children2.png`, 3.7 MB). Everything on the site is now indoor session photography.

Two watermark constraints the crops work around: `children1.jpg` carries an "m." mark bottom-right,
so its crops stay above it, and `newchildren3.jpeg` has the logo top-left, so that crop starts below
y=190.

| File | Size | Shows |
|---|---|---|
| `hero-workshop.jpg` | 1200×700 | Trainer presenting to participants around the boardroom table |
| `why-session.jpg` | 875×700 | The full group of participants indoors |
| `gallery-1-tie-practice.jpg` | 900×500 | A participant tying a necktie as the trainer demonstrates |
| `gallery-2-first-impressions.jpg` | 900×500 | Handshake demonstration under "Making Good First Impressions" |
| `gallery-3-girls-session.jpg` | 900×500 | Participants seated around the table |
| `gallery-4-presentation-practice.jpg` | 900×450 | Participants holding up their work during the speaking session |
| `gallery-5-trainer-presenting.jpg` | 900×500 | Trainer presenting beside the branded banners |
| `trainer-abenaa.jpg` | 800×1000 | Abenaa Antwiwaa Adusei, head-and-shoulders (4:5) |

Gallery images are cover-cropped to a uniform height, so exact ratios aren't critical — keep the
subject near the centre. If an image ever fails to load, `main.js` swaps in a burgundy/gold gradient
block rather than showing a broken-image icon.

Note on repo size: the six originals total about 15.8 MB — `newchildren2.jpeg` (5.2 MB),
`children3.jpeg` (5.0 MB) and `newchildren.jpeg` (3.8 MB) are the bulk, all straight-off-the-camera
6240×4160 frames. Say the word if you'd rather they moved out of version control; the eight images
the page actually loads total under 1 MB.

## Design decisions

Colours were **sampled from `inspo.jpeg`** rather than guessed, and live as custom properties at the
top of `styles.css`:

```
--burgundy      #6B1029   --gold      #C9A469   --cream   #FDF8F3
--burgundy-dark #55081C   --gold-deep #8E6420   --cream-2 #F8F2EA
--gold-btn      #D6A24A   --gold-line #E6D3B4   --cream-3 #F6F5F1
```

`--gold` is decorative only (crest, divider rules, tile borders). `--gold-deep` is the text gold —
see departure 3 below.

**Type: Poppins (headings) + Inter (body)** — this overrides the brief's Playfair Display/Lato spec,
per your instruction. The scale is deliberately restrained: the hero `h1` caps at 39px rather than
the ~51px the mockup implies at this width, with presence coming from weight, letter-spacing and
whitespace instead of size.

### Four intentional departures from the mockup

1. **Gold button uses dark burgundy text, not white.** White on `#D6A24A` is ≈2.1:1 and fails WCAG AA
   outright. Burgundy on gold measures **6.35:1**.
2. **Text gold is darkened to `#8E6420`.** The mockup's gold text colour (≈`#B4842F`) measures
   **3.17:1** on cream — it fails AA for 12.5px text, which is what it's used at ("Founder & Lead
   Trainer", the Saturday themes, the footer motto). `#8E6420` measures **4.98:1** and reads as a
   deeper antique gold. If you'd rather have exact colour fidelity than AA compliance here, change
   `--gold-deep` back — it's one line, and every gold text element follows it.
3. **A sticky Reserve bar appears below 860px.** The header CTA scrolls out of view on mobile and the
   brief calls for mobile-first, so the primary action stays reachable. Remove `.mobile-cta` from
   `index.html` if you don't want it.
4. **Icons are a single stroke system** (~32 hand-authored SVGs) where the mockup uses solid glyphs.
   A consistent stroke set at 1.7px reads cleaner and more premium at these sizes than 32
   hand-drawn solid shapes would. The three social marks are filled, as brand marks should be.

Also worth knowing: the page runs about 20% taller than the mockup at 1200px. That's mostly because
it uses the brief's **full** copy — the mockup shortens several lists (its "Build confidence and
self-esteem" is a paraphrase of the brief's "Walk confidently into a new school environment", and so
on). The brief won, as you asked.

## Accessibility

Semantic landmarks, a single `<h1>`, skip link, real `alt` text, `aria-expanded` on the menu toggle,
`Esc`-to-close, visible `:focus-visible` rings, and `prefers-reduced-motion` honoured (reveals and
smooth scrolling both switch off). Body text is 12.5–14.5px on white/cream at 4.5:1 or better.

## Verified

Driven through the Chrome DevTools Protocol, not just eyeballed:

- **No horizontal overflow at 320, 360, 414, 560, 700, 768, 834, 900, 1024, 1200, 1280 or 1440px**
  (`scrollWidth === clientWidth` at every one).
- Compared against `inspo.jpeg` section by section at 1200px. Section order and proportions track the
  mockup; the hero matches within ~1% (523px vs 518px).
- All 10 images load (`naturalWidth > 0`), and the `onerror` fallback was confirmed by pointing an
  `<img>` at a missing file: the class applies, the broken `src` is dropped, the gradient paints.
- 5 Reserve links resolve to `#register` and 2 Payment links to `#payment`; exactly one Paystack link
  and one JotForm fallback leave the site, both `target="_blank" rel="noopener"`. Every external link
  opens in a new tab. The only remaining `href="#"` are the 3 social placeholders, and clicking one
  does not scroll the page.
- The embedded form loads, has an accessible `title`, is lazy-loaded, and its auto-resize handshake
  fires — confirmed receiving `setHeight` and growing the iframe past 1200px at both 1200px and 414px.
- Nav anchors land clear of the fixed header; mobile drawer opens, locks background scroll, closes on
  `Esc` and releases the lock.
- **13 text/background pairings measured for contrast — all pass AA** at their actual rendered size.
- Every substantive line of the .docx located in the markup, and all 9 hard facts (price, dates,
  times, ages, class size, venue, the three highlight figures) matched exactly.

## Not included

No form backend and no payment integration — you said the CTAs would be tied to a link. The
Investment & Payment card is presentational: `GHS 2,100.00` and the flexible-payment note, as specified.
