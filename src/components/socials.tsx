import "../App.css";
const Socials = () => {
  return (
    <section className="next-steps w-full">
      <div className="social w-full border-t border-border">
        <ul>
          <li>
            <a href="https://github.com/aliugloria" target="_blank">
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
            <a href="https://x.com/gigi_devv" target="_blank">
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

          <li >
            <a href="https://www.linkedin.com/in/gloria-aliu/" target="_blank">
              <svg
                className="button-icon border border-gray-400 rounded-xs"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#linkedin-icon"></use>
              </svg>
              Linkedin
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Socials;

{/* <rect x="2" y="9" width="4" height="12" /> */}
// fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35"