import '../App.css'
const Socials = () => {
  return (
    <section className="next-steps w-full">
    <div className="social w-full border-t border-border">
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg
              className="button-icon"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#github-icon"></use>
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a href="https://chat.vite.dev/" target="_blank">
            <svg
              className="button-icon"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#discord-icon"></use>
            </svg>
            Discord
          </a>
        </li>
        <li>
          <a href="https://x.com/vite_js" target="_blank">
            <svg
              className="button-icon"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#x-icon"></use>
            </svg>
            X.com
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/vite.dev" target="_blank">
            <svg
              className="button-icon"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#bluesky-icon"></use>
            </svg>
            Bluesky
          </a>
        </li>
      </ul>
    </div>
  </section>
  )
}

export default Socials