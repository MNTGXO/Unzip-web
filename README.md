# ZIP-Unzip-Downloader ✔️ Vercel-Ready

## Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`, then `vercel` to deploy.
3. Your endpoint `/api/upload` handles both upload and combined download.

---

## Features

- **Serverless**: No disk writes—everything in-memory suitable for Vercel.
- **Multiple ZIPs**: Upload up to 5 `.zip` files.
- **Combined Download**: Returns a single `combined.zip`.
- **Simple UI**: Vanilla JS progress indicator.

---

## Notes

- Vercel functions have a 50 MB payload limit; large archives may fail.
- Increase memory in `vercel.json` if needed.
