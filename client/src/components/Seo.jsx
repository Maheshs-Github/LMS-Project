import { useLocation } from "react-router-dom";

const SITE_NAME = "E-Learning";
const SITE_URL = window.location.origin;
const DEFAULT_DESCRIPTION =
  "Explore online courses and develop practical skills with our learning platform.";

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  noindex = false,
  canonical,
  structuredData,
}) => {
  const location = useLocation();

  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : SITE_NAME;

  const canonicalUrl =
    canonical || `${SITE_URL}${location.pathname}`;

  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow";

  return (
    <>
      <title>{pageTitle}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {!noindex && (
        <link rel="canonical" href={canonicalUrl} />
      )}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />

      {image && (
        <meta property="og:image" content={image} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />

      {image && (
        <meta name="twitter:image" content={image} />
      )}

      {structuredData && !noindex && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
};

export default Seo;