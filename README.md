# KiwoProductions website (static HTML)

The KiwoProductions website as plain HTML, CSS and JavaScript. It has no build step, no server and no database, so it can be hosted free on **GitHub Pages**.

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero video, Our story, Our mission, What we do, Work we've made, How we work, Packages |
| `about.html`, `services.html`, `work.html`, `process.html`, `pricing.html`, `faq.html`, `contact.html` | Main pages |
| `services/*.html` | One page per service: videography, short-form content, photography, advertisement |
| `legal.html` | Terms & Conditions + Privacy Policy. Hidden: not in the menu or sitemap, only linked from "All rights reserved." in the footer |
| `thanks.html` | Shown after an enquiry is sent if the visitor's browser can't send it in the background |
| `404.html` | "Page not found" page (GitHub Pages uses it automatically) |
| `site.css` | All styling (compiled Tailwind and the site's own styles) |
| `site.js` | Menu, Services dropdown, scroll animations, hero video and the enquiry form |
| `` | Home hero loop: `hero-landscape.mp4` (computers), `hero-portrait.mp4` (phones), `hero-poster.jpg` |
| `` | The six Work photos |
| `` | Other site photos (the Our story behind-the-scenes shot) |
| `` | Logo, icons and the social-share image |
| `` | Space Grotesk and Inter, self-hosted |
| `robots.txt`, `sitemap.xml` | For search engines |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Put it on GitHub Pages

1. Create a new repository on GitHub, e.g. `kiwoproductions-website` (Public, so Pages is free).
2. Upload **everything in this folder**, including the hidden `.nojekyll` file, to the root of the repository.
   - **In the browser:** on the new repository click **uploading an existing file**, drag in all the files and folders from this folder, then **Commit changes**. (Turn on "show hidden files" on your computer so `.nojekyll` is included.)
   - **Or from a terminal** inside this folder:

   ```bash
   git init
   git add .
   git commit -m "KiwoProductions website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/kiwoproductions-website.git
   git push -u origin main
   ```

3. On GitHub, open the repository, then **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`, and save. After a minute the site is live at `https://YOUR-USERNAME.github.io/kiwoproductions-website/`.
4. **Custom domain:** in the same Pages settings, enter your domain (e.g. `www.kiwoproductions.com.au`) and save. GitHub adds a `CNAME` file for you. Then, at your domain registrar, add the DNS records GitHub shows: a `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io`, plus the `A` records for the bare domain. Tick **Enforce HTTPS** once it becomes available.

### Updating the site later

Upload the changed files over the old ones (or `git add . && git commit -m "Update" && git push`). GitHub Pages republishes within a minute or two. If a change doesn't show, refresh with Ctrl+F5 (Cmd+Shift+R on Mac).

### Set your domain in the files

Social-share previews, the sitemap and search-engine data use the full web address, which is currently set to **`https://www.kiwoproductions.com.au`**. If your domain is different, find and replace that address across all files (VS Code: Edit → Replace in Files).

## The enquiry form (FormSubmit)

The contact form sends enquiries to **kiwoproductions@gmail.com** through [FormSubmit](https://formsubmit.co), which is free and needs no account.

- **One-time activation:** the first time someone sends the form, FormSubmit emails kiwoproductions@gmail.com asking you to confirm. Click **Activate Form** in that email. Until you do, enquiries aren't delivered, so send yourself a test enquiry straight after the site goes live.
- **The form:** "General enquiry" or "Get a quote"; name, email, phone; **Interested in** (a dropdown of every monthly retainer, package and service, with prices; "Get a quote" lists only the services and "Other"); **Contract length** (3, 6 or 12 months, only shown when a monthly retainer is chosen); and the message.
- **What the email looks like:** a table with all of the above plus the item's listed price. The subject is e.g. "New enquiry from Sam (6-month retainer)" or "New quote request: Videography – Sam". **Reply** goes straight to the visitor's email.
- **Hide your email address (optional):** after activating, FormSubmit gives you a random code that can stand in for your email. In `contact.html`, replace `kiwoproductions@gmail.com` in `action="https://formsubmit.co/kiwoproductions@gmail.com"` with that code.
- **Spam:** a hidden "honeypot" field already filters out most bots. If spam gets through, change `<input type="hidden" name="_captcha" value="false">` to `value="true"` in `contact.html` to add a captcha step.

The **Enquire**, **Get a quote**, package and retainer buttons across the site link to `contact.html?service=…&term=…#enquiry-form`, which jumps to the form and fills in the item (and the contract length for retainers).

## Previewing on your computer

Double-click `index.html` and it opens in your browser; all links are relative, so it works offline. To preview it the way GitHub Pages serves it (needed for the hero video to loop smoothly), run this from the folder:

```bash
npx serve .
```

## Editing

The pages are plain HTML. To change some text, open the `.html` file, edit the words and push again. Prices appear on `pricing.html` (packages, monthly retainers, single services and the price chart), the service pages, `faq.html` and `index.html` (packages), so update every place a price appears; the names and prices in the enquiry form's dropdown are in `contact.html`.

For bigger changes it's easier to edit the Next.js source (`kiwoproductions-js`) and re-export this folder from it.
