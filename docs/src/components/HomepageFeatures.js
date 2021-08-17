import React from "react";
import clsx from "clsx";

import Link from "@docusaurus/Link";

import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "State Management",
    Svg: require("../../static/img/logo.svg").default,
    description: (
      <>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/state/intro"
          >
            Get Started
          </Link>
        </div>
      </>
    ),
  },
  {
    title: "Routing",
    Svg: require("../../static/img/logo.svg").default,
    description: (
      <>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/routing/intro"
          >
            Get Started
          </Link>
        </div>
      </>
    ),
  },
  {
    title: "Testing",
    Svg: require("../../static/img/logo.svg").default,
    description: (
      <>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/testing/intro"
          >
            Get Started
          </Link>
        </div>
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

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
