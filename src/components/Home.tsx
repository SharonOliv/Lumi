import { memo } from "react";
import { Link } from "react-router-dom";
import "../styles/rail.css";
import "./Home.css";

interface HomeSection {
  title: string;
  eyebrow: string;
  to: string;
  images: { src: string; alt: string }[];
}

const sections: HomeSection[] = [
  {
    title: "Movies",
    eyebrow: "Now showing",
    to: "/movies",
    images: [
      { src: "https://m.media-amazon.com/images/I/71OHH9HaB5S.jpg", alt: "Movies poster 1" },
      {
        src: "https://rukminim2.flixcart.com/image/850/1000/jr3t5e80/poster/h/y/t/medium-black-panther-movie-poster-for-room-office-13-inch-x-19-original-imafcz4zqkfaxxcc.jpeg?q=90&crop=false",
        alt: "Movies poster 2",
      },
      { src: "https://img.freepik.com/premium-photo/movie-poster-design_841014-8784.jpg", alt: "Movies poster 3" },
    ],
  },
  {
    title: "Live TV",
    eyebrow: "On air",
    to: "/livetv",
    images: [
      {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1OQZAp3jMeY3gX4qF1-mE8B7GoPHHJ4YizQ&s",
        alt: "Live TV 1",
      },
      { src: "https://data1.ibtimes.co.in/en/full/765037/bigg-boss-telugu-5.jpg?h=450&l=50&t=40", alt: "Live TV 2" },
      { src: "https://m.media-amazon.com/images/I/81s6DUyQCZL._AC_SL1500_.jpg", alt: "Live TV 3" },
    ],
  },
  {
    title: "TV Shows",
    eyebrow: "Binge next",
    to: "/tvshows",
    images: [
      {
        src: "https://www.tallengestore.com/cdn/shop/products/91TmR1v-qRL._RI_f7aa2caf-8e52-4bf4-9506-1595c8440c74.jpg?v=1570155292",
        alt: "TV Shows 1",
      },
      {
        src: "https://rukminim2.flixcart.com/image/850/1000/jdxeykw0/poster/6/j/k/medium-sherlock-holmes-poster-sherlock-holmes-tv-show-posters-original-imaf2qfyfubfrcke.jpeg?q=90&crop=false",
        alt: "TV Shows 2",
      },
      {
        src: "https://www.tallengestore.com/cdn/shop/products/MoneyHeist-NetflixTVShowPosterFanArt_f3ca06f4-0ea3-4795-818a-b680979e8073.jpg?v=1589268519",
        alt: "TV Shows 3",
      },
    ],
  },
];

// Memoized so re-renders of Home don't re-render every poster rail when none
// of its own props changed.
const SectionRail = memo(({ section }: { section: HomeSection }) => (
  <div className="rail">
    <div className="rail-heading">
      <p className="rail-eyebrow">{section.eyebrow}</p>
      <h2>{section.title}</h2>
    </div>
    <div className="rail-track">
      {section.images.map((img) => (
        <Link to={section.to} className="rail-card" key={img.src}>
          <img src={img.src} alt={img.alt} loading="lazy" />
        </Link>
      ))}
      <Link to={section.to} className="rail-card rail-card-more">
        <span>View all {section.title}</span>
      </Link>
    </div>
  </div>
));
SectionRail.displayName = "SectionRail";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-hero">
        <p className="home-hero-eyebrow">Multi-language &middot; All-access pass</p>
        <h1>Your seat is ready.</h1>
        <p className="home-hero-tagline">
          Movies, Live TV, and TV Shows across English, Telugu, Hindi, and Tamil &mdash; one ticket, every screen.
        </p>
        <div className="home-hero-actions">
          <Link to="/movies" className="btn-hero btn-hero-primary">
            Browse Movies
          </Link>
          <Link to="/livetv" className="btn-hero btn-hero-secondary">
            Watch Live TV
          </Link>
        </div>
      </header>

      <div className="home-rails">
        {sections.map((section) => (
          <SectionRail section={section} key={section.title} />
        ))}
      </div>
    </div>
  );
};

export default Home;
