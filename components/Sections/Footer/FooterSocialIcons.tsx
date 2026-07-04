import React from "react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 40" aria-hidden="true" className="h-[27px] w-auto">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.6,40V21.2H0v-6.8h5.6V8.7c0-4.5,3.3-8.7,11-8.7C19.7,0,22,0.3,22,0.3l-0.2,6.3c0,0-2.3,0-4.9,0c-2.8,0-3.2,1.1-3.2,3v4.9H22l-0.4,6.8h-7.9V40H5.6z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" aria-hidden="true" className="h-[27px] w-auto">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.8,0c2.7,0,4.8,2.2,4.8,4.9S7.5,9.7,4.8,9.7S0,7.5,0,4.9S2.2,0,4.8,0 M30.2,12.6c0.5,0,1.1,0,1.9,0.1c3.7,0.2,7.7,3.1,7.8,9.8C40,28,40,36.8,40,40h-8.3c0-3.3,0-10.1,0-14.9c0-2.2-1-5.1-4.5-5.1c-3.9,0-4.8,3.6-4.8,5.1c0,4.6,0,12,0,14.9h-8.3c0-4.9,0.1-21.9,0.1-26.7c4.3,0,6.3,0,7.9,0c0,1.6,0,2.6,0,3.8c1.3-2.6,4.9-4.3,6.4-4.4C29.1,12.7,29.7,12.6,30.2,12.6 M0.7,40H9V13.4H0.7V40z"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" aria-hidden="true" className="h-[27px] w-auto">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.5,0l0.3,0c0.5,0,0.9,0,1.5,0.1c2.1,0.1,3.6,0.4,4.9,0.9c1.3,0.5,2.4,1.2,3.5,2.3c1.1,1.1,1.8,2.2,2.3,3.5c0.5,1.3,0.8,2.7,0.9,4.9c0,0.3,0,0.7,0,1l0,0.3c0,0.1,0,0.3,0,0.4l0,0.3c0,1.1,0,2.3,0,5v2.8c0,2.9,0,4.2-0.1,5.3l0,0.3c0,0.4,0,0.8-0.1,1.3c-0.1,2.1-0.4,3.6-0.9,4.9c-0.5,1.3-1.2,2.4-2.3,3.5c-1.1,1.1-2.2,1.8-3.5,2.3c-1.3,0.5-2.7,0.8-4.9,0.9C26.4,40,25.6,40,21.7,40l-0.6,0l-0.2,0l0,0l-1.6,0c-0.1,0-0.2,0-0.3,0l-0.6,0c-2.6,0-3.8,0-4.9-0.1l-0.3,0c0,0-0.1,0-0.1,0l-0.3,0c-0.3,0-0.6,0-1,0c-2.1-0.1-3.6-0.4-4.9-0.9c-1.3-0.5-2.4-1.2-3.5-2.3c-1.1-1.1-1.8-2.2-2.3-3.5c-0.5-1.3-0.8-2.7-0.9-4.9c0-0.5,0-0.9-0.1-1.3l0-0.3c0-1,0-2.2-0.1-4.7l0-1.6v-0.7l0,0L0,18c0-2.8,0-3.9,0.1-5l0-0.3c0-0.3,0-0.6,0-1C0.2,9.6,0.6,8.2,1,6.9c0.5-1.3,1.2-2.4,2.3-3.5C4.5,2.2,5.6,1.6,6.9,1c1.3-0.5,2.7-0.8,4.9-0.9c0.3,0,0.7,0,1,0l0.3,0C14.1,0,15.1,0,17.7,0L22,0C24.4,0,25.5,0,26.5,0z M20,9.2C14,9.2,9.2,14,9.2,20c0,6,4.8,10.8,10.8,10.8S30.8,26,30.8,20C30.8,14,26,9.2,20,9.2z M20,13c3.9,0,7,3.1,7,7s-3.1,7-7,7s-7-3.1-7-7S16.1,13,20,13z M31.2,6.2c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S32.6,6.2,31.2,6.2z"
    />
  </svg>
);

const socialLinks = [
  { href: "https://www.facebook.com/caritaszuerich/", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.linkedin.com/company/caritas-z%C3%BCrich", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://www.instagram.com/caritaszuerich/", label: "Instagram", icon: InstagramIcon },
];

const FooterSocialIcons = () => {
  return (
    <div className="mt-2 inline-flex h-[50px] items-center justify-center rounded-[25px] bg-[hsla(0,0%,100%,0.4)] px-[25px] text-[#242424]">
      {socialLinks.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="inline-flex leading-none text-[#242424] no-underline [&+&]:ml-[15px]"
        >
          <Icon />
        </a>
      ))}
      <span className="sr-only">Link öffnet in neuem Fenster.</span>
    </div>
  );
};

export default FooterSocialIcons;
