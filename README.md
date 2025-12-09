# Portfolio Site

A minimal portfolio website for motion design, GFX, video, and photo work.

## Quick Start (Local Dev)

```bash
python3 server.py
```
Then open: http://localhost:8000

---

## Local Development

Due to browser CORS restrictions, you need to run a local server to view the site. **Do not open `index.html` directly in your browser** - use one of these methods:

### Option 1: Python Server (Recommended)

```bash
python3 server.py
```

Then open: http://localhost:8000

### Option 2: Node.js Server

```bash
npx http-server -p 8000 --cors
```

Then open: http://localhost:8000

### Option 3: VS Code Live Server

Install the "Live Server" extension in VS Code, then right-click `index.html` and select "Open with Live Server"

## Adding Projects

1. Duplicate `project-template.html` and rename it (e.g., `my-project.html`)
2. Edit the JSON metadata script tag with your project details
3. Add the filename to `projects.json`
4. Add your assets (images, videos) to the `assets/` directories

## File Structure

```
.
├── index.html              # Main landing page
├── project-template.html   # Template for new projects
├── projects.json           # List of project files
├── assets/
│   ├── images/            # Project images
│   ├── videos/            # Project videos (including reel)
│   └── svgs/              # SVG graphics
└── server.py              # Local development server
```

## Video Reels

Add your video reels to:
- `assets/videos/reel-21-9.mp4` (desktop, 21:9 aspect ratio)
- `assets/videos/reel-4-5.mp4` (mobile, 4:5 aspect ratio)

These will automatically appear on the landing page when present.

## Deployment to Cloudflare Pages

**The site works perfectly as static files - no server needed for production!**

The `server.py` and `package.json` files are **only for local development** to avoid CORS issues when testing locally. Cloudflare Pages will serve your files directly over HTTP, so everything works automatically.

### Deploying Steps:

1. **Push to GitHub** - Make sure your repository is up to date
2. **In Cloudflare Dashboard:**
   - Go to Workers & Pages
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your repository
   - Build settings:
     - **Framework preset:** None
     - **Build command:** (leave empty - no build needed)
     - **Build output directory:** `/` (root)
     - **Root directory:** (leave empty or `/`)
3. **Deploy** - Cloudflare will automatically deploy on every push to your main branch

The site will be live at: `https://your-project-name.pages.dev`

## Git LFS

Large media files are tracked with Git LFS. Make sure Git LFS is installed and initialized:
```bash
git lfs install
```

