# PeerTube Theme LunaCode 98

Retro Windows 98 look-and-feel for PeerTube using [`98.css`](https://github.com/jdan/98.css).

## Notes

- The stylesheet imports `98.css` from `https://unpkg.com/98.css`.
- If your PeerTube CSP blocks remote styles, vendor `98.css` into `assets/` and switch the `@import` to a local file.
- The client script adds retro window chrome dynamically across PeerTube pages (title bars, panel bodies, Start button and clock).
