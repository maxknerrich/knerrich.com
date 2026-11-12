<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { header } from "#lib/styles/header.ts";
  import { optionMarker } from "#lib/styles/markers.stylex.ts";
  import { reveal, shared } from "#lib/styles/shared.ts";

  // From the route, not the URL: while prerendering, `resolve()` gives relative paths.
  const inWriting = $derived(page.route.id?.startsWith("/writing") ?? false);
</script>

<a {...stylex.attrs(header.skip)} href="#main">Skip to content</a>

<header {...stylex.attrs(header.bar, reveal.enter)}>
  <a
    {...stylex.attrs(header.logoLink)}
    href={`${resolve('/')}#main`}
    aria-label="Max Knerrich, home"
  >
    <svg
      {...stylex.attrs(header.logo)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M2 18V6H5.54912L7.83397 15.9086H8.07768L10.4082 6H13.9573V18H11.901V7.76571L12.5864 8.53714H10.9871L11.8401 7.8L9.43336 18H6.46306L4.11729 7.78286L4.9703 8.53714H3.35567L4.04113 7.76571V18H2Z"
      ></path>

      <path
        d="M11.901 18V6H13.9421V12.2743L18.8164 6H21.5887L16.7296 12.0171L17.0343 10.8343L22 18H19.4105L15.7852 12.5314L16.2574 12.6171L13.9421 15.4629V18H11.901Z"
      ></path>
    </svg>
  </a>
  <nav aria-label="Main" {...stylex.attrs(header.nav)}>
    <a
      {...stylex.attrs(header.navLink, inWriting && header.navCurrent)}
      href={resolve('writing')}
      aria-current={inWriting ? "page" : undefined}
    >Writing</a>
  </nav>

  <fieldset
    aria-label="Color theme"
    {...stylex.attrs(header.themeSwitch)}
  >
    <label
      {...stylex.attrs(header.themeOption, optionMarker)}
    >
      <input
        id="theme-light"
        type="radio"
        name="theme"
        value="light"
        aria-label="Light theme"
        {...stylex.attrs(shared.visuallyHidden)}
      />

      <svg
        {...stylex.attrs(header.themeIcon)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <span {...stylex.attrs(header.themeName)} aria-hidden="true">Light</span>
    </label>

    <label
      {...stylex.attrs(header.themeOption, optionMarker)}
    >
      <input
        id="theme-dark"
        type="radio"
        name="theme"
        value="dark"
        aria-label="Dark theme"
        {...stylex.attrs(shared.visuallyHidden)}
      />

      <svg
        {...stylex.attrs(header.themeIcon)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        ></path>
      </svg>
      <span {...stylex.attrs(header.themeName)} aria-hidden="true">Dark</span>
    </label>

    <label
      {...stylex.attrs(header.themeOption, optionMarker)}
    >
      <input
        id="theme-auto"
        type="radio"
        name="theme"
        value="auto"
        aria-label="Automatic device theme"
        checked
        {...stylex.attrs(shared.visuallyHidden)}
      />

      <svg
        {...stylex.attrs(header.themeIcon)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
      <span {...stylex.attrs(header.themeName)} aria-hidden="true">Auto</span>
    </label>
  </fieldset>
</header>

