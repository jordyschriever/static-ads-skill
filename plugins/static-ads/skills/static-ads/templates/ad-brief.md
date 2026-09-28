<context>
<Product> <does what, for whom, in one or two sentences>.
This campaign runs on <channels> with the goal <goal>, for <audience>.
Read `ads/BRAND.md` first. It holds the look, the components, the owner's rulings and what we may claim. This brief only adds the concepts.
</context>

<inputs>
Campaign: <id>. Theme: <dark | light>. Formats: <ids>.
Copy lives in `ads/src/ads.json`; components read it.
</inputs>

<concepts>
1. <id> — angle: <outcome | pain | proof | comparison | launch>.
   Visual: <the real component or screen, which state, how close the crop>.
   Headline variants: "<h1>" (<what it tests>) / "<h2>".
   Support: "<optional>". Proof: <metric/quote/logos + source>. CTA: "<..>".
   Wide banners: <what survives: logo · headline · CTA>.
2. ...
3. ...
</concepts>

<direction>
<The feel in 2 or 3 short lines, in the product's own voice.>
Only the product's own surfaces, colors, borders and effects.
Banned: <from BRAND.md, plus anything the product's language does not use, words the product avoids, unsourced claims>.
</direction>

<build>
1. Vite + React in `ads/`, set up as BRAND.md "Workspace" says. Kit in `src/kit/`, one component per concept in `src/ads/`.
2. One layout per aspect class; copy from ads.json; all text via <AdText>, logo and CTA via <AdKeep>.
3. Settled UI only: static twins for anything with a clock or async state.
4. Render with `scripts/render.ts`, export with `scripts/export.py`, check with `scripts/verify.py`, sheets with `scripts/sheet.py`.
</build>

<start>
Read `ads/BRAND.md`. Before building every format, show the 3 concepts as style frames in `feed-portrait` with their copy and angle. Wait for OK.
</start>
