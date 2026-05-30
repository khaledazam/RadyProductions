import pg from 'pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DIRECT_URL or DATABASE_URL environment variables not found.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres database successfully.");

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        title TEXT NOT NULL,
        title_ar TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        video_url TEXT NOT NULL,
        location TEXT NOT NULL,
        location_ar TEXT NOT NULL
      );
    `);
    console.log("Table 'portfolio_items' created or already exists.");

    // Check if table is empty
    const checkRes = await client.query("SELECT COUNT(*) FROM portfolio_items;");
    const count = parseInt(checkRes.rows[0].count, 10);

    if (count === 0) {
      console.log("Table is empty. Seeding initial data...");
      
      const seedData = [
        {
          title: "Gabriella & Alessandro",
          title_ar: "غابرييلا وأليساندرو",
          category: "weddings",
          image: "/assets/portfolio_wedding.png",
          video_url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02af00ba84ebb0e9edcc351cc92d4b8&profile_id=165&oauth2_token_id=57447761",
          location: "Tuscany, Italy",
          location_ar: "توسكانا، إيطاليا"
        },
        {
          title: "The Neon Horizon",
          title_ar: "الأفق النيوني",
          category: "commercials",
          image: "/assets/portfolio_commercial.png",
          video_url: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f3af5e6e3d627fb4269e80e1c6670b8a1c97a8e&profile_id=165&oauth2_token_id=57447761",
          location: "Brand Commercial",
          location_ar: "إعلان تجاري للعلامة التجارية"
        },
        {
          title: "Vertex Corporate Summit",
          title_ar: "قمة فيرتكس للشركات",
          category: "corporate",
          image: "/assets/portfolio_corporate.png",
          video_url: "https://player.vimeo.com/external/510850877.sd.mp4?s=7d6c1f03f7e6f6630f907e5c54c25f46a2a5ef5c&profile_id=165&oauth2_token_id=57447761",
          location: "Cairo, Egypt",
          location_ar: "القاهرة، مصر"
        },
        {
          title: "Coastline Drone Sweep",
          title_ar: "مسح الدرون للساحل",
          category: "corporate",
          image: "/assets/portfolio_drone.png",
          video_url: "https://player.vimeo.com/external/409217109.sd.mp4?s=dcf53bdf906d44a2c534433de2022834b9d07371&profile_id=165&oauth2_token_id=57447761",
          location: "California, USA",
          location_ar: "كاليفورنيا، الولايات المتحدة"
        },
        {
          title: "Behind The Scenes: Alexa Rig",
          title_ar: "خلف الكواليس: عتاد أليكسا",
          category: "bts",
          image: "/assets/about_camera.png",
          video_url: "https://player.vimeo.com/external/454523910.sd.mp4?s=f52fa54d7f5817d7bbf1176b92131976269ebc26&profile_id=165&oauth2_token_id=57447761",
          location: "Studio BTS",
          location_ar: "كواليس الاستوديو"
        }
      ];

      for (const item of seedData) {
        await client.query(
          `INSERT INTO portfolio_items (title, title_ar, category, image, video_url, location, location_ar) 
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [item.title, item.title_ar, item.category, item.image, item.video_url, item.location, item.location_ar]
        );
      }
      console.log("Initial data seeded successfully.");
    } else {
      console.log(`Table already has ${count} items. Skipping seeding.`);
    }

  } catch (err) {
    console.error("Database setup failed:", err);
  } finally {
    await client.end();
  }
}

main();
