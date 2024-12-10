import axios from "axios";

const homepage = "https://u-shop-liart.vercel.app";

async function generateSiteMap() {
  try {
    const staticURLs = [
      {
        url: homepage,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/about`,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/categories`,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/cart`,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/checkout`,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/login`,
        lastModified: new Date().toISOString(),
      },
      {
        priority: "0.8",
        url: `${homepage}/register`,
        lastModified: new Date().toISOString(),
      },
    ];

    // Fetch dynamic data from API
    const blogData = await axios.get(
      "https://edifypk.vercel.app/api/Blog/getallblogs?titlesOnly=true"
    );
    const courseData = await axios.get(
      "http://edifypk.vercel.app/api/courses?slugsOnly=true"
    );

    // Map dynamic URLs
    // const blogURLs =
    //   blogData?.data?.message?.data?.map((v) => ({
    //     url: `${homepage}/blog/${v.slug}`,
    //     lastModified: v.createdAt || v.updatedAt,
    //     changeFrequency: "weekly",
    //     priority: 0.6,
    //   })) || [];

    // const courseURLs =
    //   courseData?.data?.message?.data?.map((v) => ({
    //     url: `${homepage}/api/courses/${v.slug}`,
    //     lastModified: v.createdAt || v.updatedAt,
    //     changeFrequency: "weekly",
    //     priority: 0.6,
    //   })) || [];

    // const allURLs = [...staticURLs, ...blogURLs, ...courseURLs];
    const allURLs = [...staticURLs];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allURLs
          .map(
            (url) => `<url>
            <loc>${url.url}</loc>
            <lastmod>${url.lastModified}</lastmod>
            <changefreq>${url.changeFrequency || "weekly"}</changefreq>
            <priority>${url.priority || 1}</priority>
          </url>`
          )
          .join("")}
      </urlset>`;

    return xml;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function getServerSideProps({ res }) {
  const sitemap = await generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {}
