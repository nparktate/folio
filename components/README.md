# Component Library

Reusable HTML components for your portfolio projects. Components are **instanced** rather than copied, so updates to component files automatically apply to all projects!

## How It Works

Instead of copying component HTML into each project file, you use simple HTML tags with `data-component` attributes. The component loader automatically fetches components from the `components/` folder and instantiates them.

**Benefits:**
- ✅ Update a component once, changes apply everywhere
- ✅ No HTML duplication
- ✅ Easy to use - just add data attributes
- ✅ Components stay organized in one place

## Setup

Include the component loader in your project HTML (before closing `</body>` tag):

```html
<script src="components/component-loader.js"></script>
```

## Available Components

### 1. Full Width Image (`full-width-image`)

**Usage:**
```html
<div data-component="full-width-image" 
     data-imageurl="assets/images/hero.jpg" 
     data-imagealt="Hero image description"
     data-caption="Optional caption text">
</div>
```

**Attributes:**
- `data-imageurl` - Path to image file (required)
- `data-imagealt` - Alt text for accessibility (required)
- `data-caption` - Optional caption below image

---

### 2. Image Carousel (`image-carousel`)

**Usage:**
```html
<div data-component="image-carousel" 
     data-images='["img1.jpg","img2.jpg","img3.jpg"]'
     data-captions='["Caption 1","Caption 2","Caption 3"]'
     data-alts='["Alt 1","Alt 2","Alt 3"]'
     data-uniqueid="project-carousel">
</div>
```

**Attributes:**
- `data-images` - JSON array of image URLs (required)
- `data-captions` - JSON array of captions (optional)
- `data-alts` - JSON array of alt texts (optional)
- `data-uniqueid` - Unique ID for this carousel (optional, auto-generated if not provided)

**Note:** Use single quotes around JSON arrays!

---

### 3. Grid 2-1 (`grid-2-1`)

Two images on top, one wide image below.

**Usage:**
```html
<div data-component="grid-2-1" 
     data-image1url="assets/images/top1.jpg" 
     data-image1alt="Top left image"
     data-image2url="assets/images/top2.jpg" 
     data-image2alt="Top right image"
     data-image3url="assets/images/bottom.jpg" 
     data-image3alt="Bottom image"
     data-caption1="Caption 1"
     data-caption2="Caption 2"
     data-caption3="Caption 3">
</div>
```

**Attributes:**
- `data-image1url`, `data-image2url`, `data-image3url` - Image URLs (required)
- `data-image1alt`, `data-image2alt`, `data-image3alt` - Alt texts (required)
- `data-caption1`, `data-caption2`, `data-caption3` - Optional captions

---

### 4. Grid 3 (`grid-3`)

Three equal-width columns.

**Usage:**
```html
<div data-component="grid-3" 
     data-image1url="assets/images/img1.jpg" 
     data-image1alt="Image 1"
     data-image2url="assets/images/img2.jpg" 
     data-image2alt="Image 2"
     data-image3url="assets/images/img3.jpg" 
     data-image3alt="Image 3"
     data-caption1="Caption 1"
     data-caption2="Caption 2"
     data-caption3="Caption 3">
</div>
```

**Attributes:**
- `data-image1url`, `data-image2url`, `data-image3url` - Image URLs (required)
- `data-image1alt`, `data-image2alt`, `data-image3alt` - Alt texts (required)
- `data-caption1`, `data-caption2`, `data-caption3` - Optional captions

---

### 5. Video Embed (`video-embed`)

**Usage:**
```html
<div data-component="video-embed" 
     data-videourl="assets/videos/video.mp4" 
     data-videoposter="assets/images/poster.jpg"
     data-videocaption="Video caption text"
     data-videodescription="Optional description text">
</div>
```

**Attributes:**
- `data-videourl` - Path to video file (required)
- `data-videoposter` - Poster/thumbnail image (optional)
- `data-videocaption` - Caption below video (optional)
- `data-videodescription` - Description text (optional)

---

### 6. Text Block (`text-block`) - Multiple Variants

**Variants:**
- `title-paragraph` - Title + paragraph(s) (default)
- `paragraph` - Paragraph(s) only, no title
- `quote` - Italic quote with border/quotes
- `title-only` - Just a title heading

**Usage - Title + Paragraph (default):**
```html
<div data-component="text-block" 
     data-variant="title-paragraph"
     data-textcontent="<h2>Heading</h2><p>Paragraph text here.</p>" 
     data-textalign="left">
</div>
```

**Usage - Paragraph Only:**
```html
<div data-component="text-block" 
     data-variant="paragraph"
     data-textcontent="<p>Just paragraph text, no title.</p>" 
     data-textalign="center">
</div>
```

**Usage - Quote:**
```html
<div data-component="text-block" 
     data-variant="quote"
     data-quotetext="Your quote text here"
     data-quoteauthor="Optional author name"
     data-textalign="center">
</div>
```

**Usage - Title Only:**
```html
<div data-component="text-block" 
     data-variant="title-only"
     data-titletext="Section Title"
     data-textalign="left">
</div>
```

**Attributes:**
- `data-variant` - Variant type: `title-paragraph`, `paragraph`, `quote`, or `title-only` (default: `title-paragraph`)
- `data-textcontent` - HTML content for title-paragraph or paragraph variants (required for those variants)
- `data-titletext` - Title text for title-only variant (required for title-only)
- `data-quotetext` - Quote text for quote variant (required for quote)
- `data-quoteauthor` - Optional author for quote variant
- `data-textalign` - Text alignment: `left`, `center`, or `right` (default: `left`)

**Notes:**
- All variants have a max-width of 700px to prevent text from being too wide
- Quote variant has special styling: left border for left/right alignment, top/bottom borders for center
- Title-only variant is larger (1.8rem) and bold

---

## Complete Example

```html
<div class="project-content">
    <!-- Full width hero image -->
    <div data-component="full-width-image" 
         data-imageurl="assets/images/hero.jpg" 
         data-imagealt="Project hero"
         data-caption="Main project image">
    </div>

    <!-- Text description -->
    <div data-component="text-block" 
         data-textcontent="<h2>About This Project</h2><p>Description here...</p>" 
         data-textalign="center">
    </div>

    <!-- Image carousel -->
    <div data-component="image-carousel" 
         data-images='["img1.jpg","img2.jpg","img3.jpg"]'
         data-captions='["Frame 1","Frame 2","Frame 3"]'
         data-uniqueid="project-carousel">
    </div>

    <!-- Grid layout -->
    <div data-component="grid-2-1" 
         data-image1url="img1.jpg" 
         data-image1alt="Image 1"
         data-image2url="img2.jpg" 
         data-image2alt="Image 2"
         data-image3url="img3.jpg" 
         data-image3alt="Image 3">
    </div>
</div>

<script src="components/component-loader.js"></script>
```

## Updating Components

To update a component's styling or structure:

1. Edit the component file in `components/` folder (e.g., `components/full-width-image.html`)
2. All projects using that component will automatically use the updated version!

No need to edit individual project files.

## Tips

- **JSON arrays:** When using `data-images` or `data-captions`, use single quotes around the JSON array: `data-images='["img1.jpg","img2.jpg"]'`
- **Unique IDs:** For carousels, provide unique IDs if you have multiple carousels on one page
- **HTML in text:** The text-block component supports HTML tags in `data-textcontent`
- **Image paths:** Use relative paths from project HTML file location (e.g., `assets/images/photo.jpg`)
