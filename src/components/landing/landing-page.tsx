import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  MapPin,
  Route,
  Sparkles,
} from "lucide-react";
import { DestinationPhoto } from "@/components/overview/destination-photo";
import styles from "./landing.module.css";

export function LandingPage() {
  return (
    <div className={styles.landing}>
      <section className={styles.hero} aria-labelledby="landing-title">
        <p className={styles.eyebrow}>
          <Compass size={16} /> A little room for adventure
        </p>
        <h1 id="landing-title">
          Less planning.
          <br />
          <span>More possibilities.</span>
        </h1>
        <p className={styles.intro}>
          Turn your someday places into a trip that feels like you.
          <br className="hidden sm:block" /> Your destinations, favorite finds,
          and little detours. Together.
        </p>
        <div className={styles.actions}>
          <Link className={styles.lightButton} href="/trips">
            Explore your trips <ArrowUpRight size={18} />
          </Link>
          <Link className={styles.ghostButton} href="/builder">
            Start a new trip <ArrowUpRight size={18} />
          </Link>
        </div>
        <div
          className={styles.floatingCards}
          aria-label="A glimpse of a Japan trip"
        >
          <article className={`${styles.floatCard} ${styles.leftCard}`}>
            <div className={styles.photo}>
              <DestinationPhoto src="/images/france.jpg" />
            </div>
            <span className={styles.eyebrow}>The next chapter</span>
            <h2>A Paris kind of day.</h2>
            <p>A coffee. A walk. No rush.</p>
          </article>
          <article className={`${styles.floatCard} ${styles.centerCard}`}>
            <div className={styles.cover}>
              <DestinationPhoto src="/images/japan.jpg" priority />
            </div>
            <div className={styles.coverText}>
              <span className={styles.eyebrow}>
                <MapPin size={14} /> Japan, in bloom
              </span>
              <h2>
                Take the
                <br />
                scenic route.
              </h2>
              <span>Tokyo · Kyoto · Osaka</span>
            </div>
          </article>
          <article className={`${styles.floatCard} ${styles.rightCard}`}>
            <span className={styles.eyebrow}>
              <Route size={16} /> Your route, your rhythm
            </span>
            <h2>
              A little city.
              <br />A little serenity.
            </h2>
            <ol className={styles.miniRoute}>
              <li>
                <span>01</span> Tokyo <small>4 days</small>
              </li>
              <li>
                <span>02</span> Kyoto <small>4 days</small>
              </li>
              <li>
                <span>03</span> Osaka <small>2 days</small>
              </li>
            </ol>
            <p>Leave room for the unexpected.</p>
          </article>
        </div>
        <a href="#possibilities" className={styles.scrollHint}>
          A whole trip, coming together <ArrowDown size={16} />
        </a>
      </section>

      <section
        id="possibilities"
        className={styles.story}
        aria-labelledby="story-title"
      >
        <div className={styles.stickyCopy}>
          <p className={styles.eyebrow}>
            <Sparkles size={16} /> Big ideas. Little details.
          </p>
          <h2 id="story-title">
            A trip is more
            <br />
            than a checklist.
          </h2>
          <p>
            It’s the places you’ve saved. The food you can’t wait to try. And
            the space between, where the best stories happen.
          </p>
          <Link href="/trips" className={styles.textLink}>
            Find your next chapter <ArrowUpRight size={18} />
          </Link>
          <span className={styles.storyNote}>
            Explore four sample trips. Make yourself at home.
          </span>
        </div>
        <div className={styles.storyCards}>
          <article className={`${styles.storyCard} ${styles.destination}`}>
            <div className={styles.storyPhoto}>
              <DestinationPhoto src="/images/italy.jpg" />
            </div>
            <div className={styles.storyText}>
              <span className={styles.eyebrow}>01 / Follow your curiosity</span>
              <h3>
                Start with
                <br />
                somewhere.
              </h3>
              <p>
                Six countries. A world of possibilities.
                <br />
                Find the place that pulls you in.
              </p>
            </div>
          </article>
          <article className={`${styles.storyCard} ${styles.routeCard}`}>
            <span className={styles.eyebrow}>02 / See the bigger picture</span>
            <h3>
              Every little detail.
              <br />
              One lovely view.
            </h3>
            <p>
              Dates, people, places, and your wish list. Get a feel for the
              whole adventure at a glance.
            </p>
            <div className={styles.previewGrid}>
              <div>
                <span>Days away</span>
                <strong>
                  10<span> days</span>
                </strong>
              </div>
              <div>
                <span>Good company</span>
                <strong>
                  2<span> travelers</span>
                </strong>
              </div>
              <div>
                <Route size={22} />
                <strong>Tokyo → Kyoto → Osaka</strong>
              </div>
            </div>
          </article>
          <article className={`${styles.storyCard} ${styles.ideasCard}`}>
            <span className={styles.eyebrow}>
              03 / Make space for good things
            </span>
            <h3>
              A little more
              <br />
              “that’s so us.”
            </h3>
            <p>
              Street food or quiet gardens? A museum morning or a coastal
              escape? Explore ideas that give a trip its personality.
            </p>
            <div className={styles.tags}>
              <span>Food & gastronomy</span>
              <span>Nature & wildlife</span>
              <span>Museums & culture</span>
              <span>Beaches & relaxation</span>
            </div>
            <Sparkles
              className={styles.bigIcon}
              strokeWidth={1}
              aria-hidden="true"
            />
          </article>
        </div>
      </section>
      <section className={styles.finale}>
        <Compass size={36} strokeWidth={1.5} />
        <p className={styles.eyebrow}>The best part is still ahead</p>
        <h2>
          Where will you
          <br />
          go from here?
        </h2>
        <Link href="/trips" className={styles.lightButton}>
          Let’s find out <ArrowUpRight size={18} />
        </Link>
        <p className={styles.finaleNote}>
          Start with a sample trip. Let your imagination do the rest.
        </p>
      </section>
    </div>
  );
}
