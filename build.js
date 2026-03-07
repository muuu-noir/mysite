const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://mog147.github.io/mysite';
const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const TEMPLATE_PATH = path.join(__dirname, 'blog', '_template.html');
const OUTPUT_DIR = path.join(__dirname, 'blog');
const INDEX_JSON_PATH = path.join(OUTPUT_DIR, 'index.json');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// Read template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Collect all markdown files
const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

if (mdFiles.length === 0) {
    console.log('No markdown files found in blog/posts/');
    process.exit(0);
}

const articles = [];

for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: fm, content } = matter(raw);

    const slug = file.replace(/\.md$/, '');
    const htmlFilename = slug + '.html';
    const articleUrl = `${SITE_URL}/blog/${htmlFilename}`;

    // Format date
    const date = new Date(fm.date);
    const dateISO = date.toISOString().split('T')[0];
    const dateFormatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    // Convert markdown to HTML
    const htmlContent = marked(content);

    // Build JSON-LD for Article
    const jsonld = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': fm.title,
        'datePublished': dateISO,
        'dateModified': dateISO,
        'author': {
            '@type': 'Person',
            'name': '手塚桃子',
            'url': SITE_URL + '/'
        },
        'description': fm.description || '',
        'image': fm.image ? `${SITE_URL}/${fm.image}` : `${SITE_URL}/img/profile/profile_avatar.png`,
        'url': articleUrl,
        'publisher': {
            '@type': 'Person',
            'name': '手塚桃子',
            'logo': {
                '@type': 'ImageObject',
                'url': `${SITE_URL}/img/profile/profile_avatar.png`
            }
        }
    }, null, 8);

    // OG image
    const ogImage = fm.image ? `${SITE_URL}/${fm.image}` : `${SITE_URL}/img/profile/profile_avatar.png`;

    // Fill template
    let html = template
        .replace(/\{\{title\}\}/g, fm.title)
        .replace(/\{\{description\}\}/g, fm.description || '')
        .replace(/\{\{url\}\}/g, articleUrl)
        .replace(/\{\{ogImage\}\}/g, ogImage)
        .replace(/\{\{dateISO\}\}/g, dateISO)
        .replace(/\{\{dateFormatted\}\}/g, dateFormatted)
        .replace(/\{\{category\}\}/g, fm.category || '')
        .replace(/\{\{content\}\}/g, htmlContent)
        .replace(/\{\{jsonld\}\}/g, jsonld);

    // Write HTML
    const outputPath = path.join(OUTPUT_DIR, htmlFilename);
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`Generated: blog/${htmlFilename}`);

    // Add to index
    articles.push({
        slug,
        title: fm.title,
        date: dateISO,
        dateFormatted,
        category: fm.category || '',
        description: fm.description || '',
        image: fm.image || '',
        url: `blog/${htmlFilename}`
    });
}

// Sort by date descending
articles.sort((a, b) => b.date.localeCompare(a.date));

// Write index.json
fs.writeFileSync(INDEX_JSON_PATH, JSON.stringify(articles, null, 2), 'utf-8');
console.log(`Generated: blog/index.json (${articles.length} articles)`);

// Update sitemap.xml
updateSitemap(articles);

function updateSitemap(articles) {
    // Read existing sitemap
    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');

    // Remove any existing blog entries
    sitemap = sitemap.replace(/\s*<!-- blog-start -->[\s\S]*?<!-- blog-end -->/g, '');

    // Build blog entries
    const blogEntries = articles.map(a => `  <url>
    <loc>${SITE_URL}/blog/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <priority>0.7</priority>
  </url>`).join('\n');

    const blogBlock = `\n  <!-- blog-start -->\n${blogEntries}\n  <!-- blog-end -->`;

    // Insert before </urlset>
    sitemap = sitemap.replace('</urlset>', `${blogBlock}\n</urlset>`);

    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
    console.log('Updated: sitemap.xml');
}

console.log('\nBuild complete!');
