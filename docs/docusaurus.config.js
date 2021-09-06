module.exports = {
  title: "Version One Dev Utils",
  tagline: "APIs and best practices for use when developing Version One apps.",
  url: "https://example.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  themeConfig: {
    navbar: {
      logo: {
        alt: "Version One Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          position: "left",
          label: "State Management",
          type: "doc",
          docId: "state/intro",
        },
        {
          position: "left",
          label: "Routing",
          type: "doc",
          docId: "routing/intro",
        },
        {
          position: "left",
          label: "Testing",
          type: "doc",
          docId: "testing/intro",
        },
        {
          position: "left",
          label: "Forms",
          type: "doc",
          docId: "forms/useForm",
        },
        {
          href: "https://github.com/VersionOneDev/version-one-dev-utils",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Version One Development Ltd`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/VersionOneDev/version-one-dev-utils/edit/documentation/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
