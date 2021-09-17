import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import Link from "@docusaurus/Link";

import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Get Started",
    Svg: require("../../static/img/getStarted.svg").default,
    path: "/docs/intro",
  },
  {
    title: "Styles (CSS)",
    Svg: require("../../static/img/style.svg").default,
    path: "/docs/intro",
  },
  {
    title: "State Management",
    Svg: require("../../static/img/state.svg").default,
    path: "/docs/state/intro",
  },
  {
    title: "Routing",
    Svg: require("../../static/img/routing.svg").default,
    path: "/docs/routing/intro",
  },
  {
    title: "Forms",
    Svg: require("../../static/img/forms.svg").default,
    path: "/docs/forms/useForm",
  },
  {
    title: "Testing",
    Svg: require("../../static/img/tests.svg").default,
    path: "/docs/testing/intro",
  },
];

function Feature({ Svg, title, path }) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <Link
        className={clsx(
          "button button--secondary button--lg text--center",
          styles.featureButton
        )}
        to={path}
      >
        <Svg className={styles.featureSvg} alt={title} />
        <div>{title}</div>
      </Link>
    </div>
  );
}

Feature.propTypes = {
  Svg: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
