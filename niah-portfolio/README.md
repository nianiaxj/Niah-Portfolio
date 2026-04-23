# Niah's House

A soft, whimsical personal portfolio site — content, art, poetry, and interactive projects.

## Structure

- `index.html` — root entry point
- `style.css` — all styles (pastel theme, lace frames, pink scrolls)
- `script.js` — interactivity (modals, reveals, custom cursor)
- `assets/` — images, icons, and the custom wand cursor
  - `assets/images/` — clouds, tiny door, gumball, etc.

## Run locally

Any static file server works. For example:

```
python3 -m http.server 5000
```

Then visit http://localhost:5000.

## Deploy

The site is static and ready for GitHub Pages. The included `.nojekyll` file ensures all assets (including paths starting with `_`) are served as-is.

To publish on GitHub Pages: in the repo settings, set Pages → Source to the branch you push, root folder.
