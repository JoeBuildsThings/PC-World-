export const hireServices = [
  {
    number: "01",
    title: "Backend services and APIs.",
    description:
      "Reliable server endpoints, authentication flows, data pipelines, and third party integrations built with clear contracts and automated verification.",
    deliverables: "REST APIS / DATA MODELS / INTEGRATIONS",
  },
  {
    number: "02",
    title: "Browser tools that solve a real task.",
    description:
      "Interactive utilities, internal dashboards, and focused web applications shaped around how people actually get work done.",
    deliverables: "DASHBOARDS / WEB APPS / CUSTOM TOOLS",
  },
  {
    number: "03",
    title: "Websites that explain the offer.",
    description:
      "Responsive landing pages, business websites, and storefront experiences with crisp typography and purposeful calls to action.",
    deliverables: "BUSINESS SITES / LANDING PAGES / STOREFRONTS",
  },
] as const;

export const hireCapabilities = [
  "HTTP APIs",
  "Relational Databases",
  "Authentication Flows",
  "Webhook Automation",
  "Static Web Exports",
  "End to End Testing",
  "Security Auditing",
  "Cloud Deployment",
] as const;

export const hireProcess = [
  [
    "01",
    "Scope",
    "Agree on the problem, audience, deliverables, timeline, and constraints before implementation.",
  ],
  [
    "02",
    "Build",
    "Work in visible milestones, with decisions and progress kept clear.",
  ],
  [
    "03",
    "Verify",
    "Test the important flows, fix defects, and prepare a clean handover.",
  ],
] as const;

export function HireView() {
  return (
    <main id="main-content" className="detail-page hire-page anim-page-reveal">
      <section className="detail-hero section-wrap">
        <div className="detail-kicker">
          <span className="eyebrow">01 / Work with JoeBuildsThings</span>
          <span className="detail-index">INDEPENDENT DEVELOPER</span>
        </div>

        <div className="detail-hero-grid">
          <div>
            <p className="detail-pretitle">MAKE THE NEXT IDEA USEFUL.</p>
            <h1 className="detail-title">
              Web products
              <br />
              <span>built to do a job.</span>
            </h1>
          </div>
          <div className="detail-summary">
            <p>
              I build backend services, browser tools, and full stack web
              applications for businesses, creators, and teams with a clear
              problem to solve.
            </p>
            <p>
              This page is for paid project enquiries. The workstation support
              request has its own separate page and is not part of client work.
            </p>
          </div>
        </div>

        <div className="support-status-line">
          <span>OPEN TO SCOPED PROJECTS</span>
          <span>REMOTE COLLABORATION</span>
          <span>NO FABRICATED CLIENT CLAIMS</span>
        </div>
      </section>

      <section className="hire-services section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / What I can build</p>
            <h2>
              Useful work.
              <br />
              <span>Clearly scoped.</span>
            </h2>
          </div>
          <p className="section-intro">
            Start with the outcome you need. The implementation should serve the
            job, not the other way around.
          </p>
        </div>

        <div className="hire-service-list">
          {hireServices.map((service) => (
            <article className="hire-service" key={service.number}>
              <span className="hire-service-number">{service.number}</span>
              <div className="hire-service-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span>{service.deliverables}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-section section-wrap">
        <div>
          <p className="eyebrow">03 / Core capabilities</p>
          <h2>
            A practical
            <br />
            <span>engineering kit.</span>
          </h2>
          <p>
            Architecture is selected around the requirements, hosting
            constraints, maintainability, and the people who will use the
            product.
          </p>
        </div>
        <ul className="stack-list" aria-label="Engineering capabilities">
          {hireCapabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="process-section section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / Working process</p>
            <h2>
              From brief
              <br />
              <span>to handover.</span>
            </h2>
          </div>
        </div>

        <div className="process-grid">
          {hireProcess.map(([number, title, description]) => (
            <article className="process-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hire-contact section-wrap" id="contact">
        <div>
          <p className="eyebrow">05 / Project enquiries</p>
          <h2>
            Have a clear
            <br />
            <span>problem to solve?</span>
          </h2>
          <p>
            Reach out directly by email at adebiyijosephayomide@gmail.com, on
            TikTok (@joebuildsthings), or on LinkedIn for paid backend and web
            development work, or inspect the public repositories on GitHub to
            review recent engineering work.
          </p>
        </div>
        <div className="support-contact-actions">
          <a
            className="button button-primary"
            href="mailto:adebiyijosephayomide@gmail.com?subject=CREATOR%20ARCADE%20%7C%20Project%20enquiry"
          >
            Email adebiyijosephayomide@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <a
            className="support-contact-secondary"
            href="https://www.tiktok.com/@joebuildsthings"
            target="_blank"
            rel="noreferrer"
          >
            DM on TikTok (@joebuildsthings) <span aria-hidden="true">↗</span>
          </a>
          <a
            className="support-contact-secondary"
            href="https://www.linkedin.com/in/joseph-ayomide-adebiyi-5bb66844b/"
            target="_blank"
            rel="noreferrer"
          >
            Discuss a project on LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            className="button button-dark"
            href="https://github.com/JoeBuildsThings/carter-exe"
            target="_blank"
            rel="noreferrer"
          >
            Inspect this project <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
