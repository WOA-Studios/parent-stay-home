# Parent Stay Home — MailerLite Emergency Sheet Integration

This is a targeted update for the existing `parent-stay-home` GitHub repository.

## What changes

Only this page is replaced:

`/get-organized/parent-emergency-information-sheet/index.html`

The update:

- keeps the interactive Parent Emergency Information Sheet available without an email signup;
- keeps the **Print or save this page** option;
- removes the public **Download blank PDF** button;
- adds the MailerLite Universal script for account `2647244`;
- embeds MailerLite form `ZMHmmD`;
- explains that the downloadable PDF is sent after email confirmation;
- leaves the existing PDF file in `/assets/downloads/` untouched so the active MailerLite delivery email can continue linking to it.

## Upload

Upload the extracted `get-organized` folder to the root of the existing `parent-stay-home` repository.
Allow GitHub to replace the existing:

`get-organized/parent-emergency-information-sheet/index.html`

Do **not** delete or replace the existing PDF in `/assets/downloads/`.

Suggested commit message:

`Add MailerLite signup to emergency information sheet`

After Cloudflare deploys, test the live flow:

1. Open the Parent Emergency Information Sheet page.
2. Confirm the public Download blank PDF button is gone.
3. Confirm the MailerLite form loads.
4. Submit a test email address.
5. Confirm the double-opt-in email.
6. Confirm the automation sends the delivery email.
7. Click the delivery button and confirm the PDF opens.
