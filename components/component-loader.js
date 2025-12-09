/**
 * Component Loader System
 * 
 * Usage in project.html:
 * <div data-component="image-carousel" 
 *      data-images='["url1.jpg","url2.jpg","url3.jpg"]'
 *      data-captions='["Caption 1","Caption 2","Caption 3"]'
 *      data-id="unique-carousel-id">
 * </div>
 * 
 * Components are loaded from components/ folder and automatically instantiated.
 */

(async function() {
    const componentCache = new Map();

    // Load component HTML from file
    async function loadComponent(name) {
        if (componentCache.has(name)) {
            return componentCache.get(name);
        }

        try {
            const response = await fetch(`components/${name}.html`);
            if (!response.ok) {
                console.error(`Component ${name} not found`);
                return null;
            }
            const html = await response.text();
            componentCache.set(name, html);
            return html;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            return null;
        }
    }

    // Replace placeholders in component HTML with actual values
    function instantiateComponent(html, element) {
        let instantiated = html;

        // Get all data attributes from the element
        const dataAttrs = {};
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-component') {
                const key = attr.name.replace('data-', '').replace(/-/g, '');
                dataAttrs[key] = attr.value;
            }
        }

        // Replace common placeholders
        // Image placeholders
        for (let i = 1; i <= 10; i++) {
            const imageKey = `image${i}url`;
            const altKey = `image${i}alt`;
            const captionKey = `caption${i}`;
            
            if (dataAttrs[imageKey]) {
                instantiated = instantiated.replace(
                    new RegExp(`\\[IMAGE-${i}-URL\\]`, 'g'),
                    dataAttrs[imageKey]
                );
            }
            if (dataAttrs[altKey]) {
                instantiated = instantiated.replace(
                    new RegExp(`\\[IMAGE-${i}-ALT\\]`, 'g'),
                    dataAttrs[altKey]
                );
            }
            if (dataAttrs[captionKey]) {
                instantiated = instantiated.replace(
                    new RegExp(`\\[CAPTION-${i}\\]`, 'g'),
                    dataAttrs[captionKey]
                );
            }
        }

        // Handle JSON arrays for multiple images/captions - special handling for image-carousel
        if (element.getAttribute('data-component') === 'image-carousel' && dataAttrs.images) {
            try {
                const images = JSON.parse(dataAttrs.images);
                const captions = dataAttrs.captions ? JSON.parse(dataAttrs.captions) : [];
                const alts = dataAttrs.alts ? JSON.parse(dataAttrs.alts) : [];
                
                // Generate slides dynamically (images only in slides, captions separate)
                let slidesHTML = '';
                let captionsData = [];
                images.forEach((img, i) => {
                    const caption = captions[i] || '';
                    const alt = alts[i] || `Image ${i + 1}`;
                    slidesHTML += `                <div class="carousel-slide">
                    <img src="${img}" alt="${alt}">
                </div>
`;
                    captionsData.push(caption);
                });
                
                // Replace the carousel-track content (handle both empty and populated tracks)
                if (images.length > 0) {
                    instantiated = instantiated.replace(
                        /<div class="carousel-track">[\s\S]*?<\/div>/m,
                        `<div class="carousel-track">
${slidesHTML}            </div>`
                    );
                }
                
                // Store captions as data attribute on container for JavaScript
                // Note: [UNIQUE-ID] will be replaced later in singleReplacements
                instantiated = instantiated.replace(
                    /id="carousel-\[UNIQUE-ID\]"/,
                    `id="carousel-[UNIQUE-ID]" data-captions='${JSON.stringify(captionsData)}'`
                );
                
                // Remove any remaining image placeholders
                for (let i = 1; i <= 10; i++) {
                    instantiated = instantiated.replace(new RegExp(`\\[IMAGE-${i}-URL\\]`, 'g'), '');
                    instantiated = instantiated.replace(new RegExp(`\\[IMAGE-${i}-ALT\\]`, 'g'), '');
                    instantiated = instantiated.replace(new RegExp(`\\[CAPTION-${i}\\]`, 'g'), '');
                }
            } catch (e) {
                console.error('Error parsing images array for carousel:', e);
            }
        } else {
            // Handle individual image placeholders (for non-carousel components or carousels with individual images)
            if (dataAttrs.images) {
                try {
                    const images = JSON.parse(dataAttrs.images);
                    images.forEach((img, i) => {
                        instantiated = instantiated.replace(
                            new RegExp(`\\[IMAGE-${i + 1}-URL\\]`, 'g'),
                            img
                        );
                    });
                } catch (e) {
                    console.error('Error parsing images array:', e);
                }
            }

            if (dataAttrs.captions) {
                try {
                    const captions = JSON.parse(dataAttrs.captions);
                    captions.forEach((cap, i) => {
                        instantiated = instantiated.replace(
                            new RegExp(`\\[CAPTION-${i + 1}\\]`, 'g'),
                            cap || ''
                        );
                    });
                } catch (e) {
                    console.error('Error parsing captions array:', e);
                }
            }

            if (dataAttrs.alts) {
                try {
                    const alts = JSON.parse(dataAttrs.alts);
                    alts.forEach((alt, i) => {
                        instantiated = instantiated.replace(
                            new RegExp(`\\[IMAGE-${i + 1}-ALT\\]`, 'g'),
                            alt || ''
                        );
                    });
                } catch (e) {
                    console.error('Error parsing alts array:', e);
                }
            }
        }

        // Single value replacements
        const singleReplacements = {
            'imageurl': '[IMAGE-URL]',
            'imagealt': '[IMAGE-ALT]',
            'caption': '[CAPTION]',
            'videourl': '[VIDEO-URL]',
            'videoposter': '[VIDEO-POSTER]',
            'videocaption': '[VIDEO-CAPTION]',
            'videodescription': '[VIDEO-DESCRIPTION]',
            'textcontent': '[TEXT-CONTENT]',
            'textalign': '[TEXT-ALIGN]',
            'uniqueid': '[UNIQUE-ID]',
            'variant': '[VARIANT]',
            'quotetext': '[QUOTE-TEXT]',
            'quoteauthor': '[QUOTE-AUTHOR]',
            'titletext': '[TITLE-TEXT]'
        };

        for (const [key, placeholder] of Object.entries(singleReplacements)) {
            if (dataAttrs[key]) {
                instantiated = instantiated.replace(
                    new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    dataAttrs[key]
                );
            }
        }

        // Set default for text-align if not provided
        if (!dataAttrs.textalign) {
            instantiated = instantiated.replace(/\[TEXT-ALIGN\]/g, 'left');
        }

        // Set default for unique-id if not provided (generate one)
        if (!dataAttrs.uniqueid) {
            const randomId = 'comp-' + Math.random().toString(36).substr(2, 9);
            instantiated = instantiated.replace(/\[UNIQUE-ID\]/g, randomId);
        }

        // Handle text-block variants (only if component is text-block)
        if (element.getAttribute('data-component') === 'text-block') {
            const variant = dataAttrs.variant || 'title-paragraph';
            instantiated = instantiated.replace(/\[VARIANT\]/g, variant);
            
            // Show/hide variant-specific elements
            const displayParagraph = (variant === 'paragraph') ? 'block' : 'none';
            const displayTitleParagraph = (variant === 'title-paragraph') ? 'block' : 'none';
            const displayQuote = (variant === 'quote') ? 'block' : 'none';
            const displayTitleOnly = (variant === 'title-only') ? 'block' : 'none';
            
            instantiated = instantiated.replace(/\[DISPLAY-PARAGRAPH\]/g, displayParagraph);
            instantiated = instantiated.replace(/\[DISPLAY-TITLE-PARAGRAPH\]/g, displayTitleParagraph);
            instantiated = instantiated.replace(/\[DISPLAY-QUOTE\]/g, displayQuote);
            instantiated = instantiated.replace(/\[DISPLAY-TITLE-ONLY\]/g, displayTitleOnly);
            
            // Handle quote-specific replacements
            if (variant === 'quote') {
                if (dataAttrs.quotetext) {
                    instantiated = instantiated.replace(/\[QUOTE-TEXT\]/g, dataAttrs.quotetext);
                } else {
                    instantiated = instantiated.replace(/\[QUOTE-TEXT\]/g, '');
                }
                const textAlign = dataAttrs.textalign || 'left';
                if (dataAttrs.quoteauthor) {
                    // For centered quotes, author goes below. For left/right, author is inline.
                    if (textAlign === 'center') {
                        instantiated = instantiated.replace(/\[QUOTE-AUTHOR\]/g, dataAttrs.quoteauthor);
                        instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-INLINE\]/g, 'none');
                        instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-BELOW\]/g, 'block');
                    } else {
                        instantiated = instantiated.replace(/\[QUOTE-AUTHOR\]/g, dataAttrs.quoteauthor);
                        instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-INLINE\]/g, 'inline');
                        instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-BELOW\]/g, 'none');
                    }
                } else {
                    instantiated = instantiated.replace(/\[QUOTE-AUTHOR\]/g, '');
                    instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-INLINE\]/g, 'none');
                    instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-BELOW\]/g, 'none');
                }
            } else {
                instantiated = instantiated.replace(/\[QUOTE-TEXT\]/g, '');
                instantiated = instantiated.replace(/\[QUOTE-AUTHOR\]/g, '');
                instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-INLINE\]/g, 'none');
                instantiated = instantiated.replace(/\[DISPLAY-AUTHOR-BELOW\]/g, 'none');
            }
            
            // Handle title-only replacements
            if (variant === 'title-only') {
                if (dataAttrs.titletext) {
                    instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, dataAttrs.titletext);
                } else if (dataAttrs.textcontent) {
                    // Extract title from textcontent if titletext not provided
                    const titleMatch = dataAttrs.textcontent.match(/<h2[^>]*>(.*?)<\/h2>/i);
                    if (titleMatch) {
                        instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, titleMatch[1]);
                    } else {
                        instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, dataAttrs.textcontent.replace(/<[^>]*>/g, ''));
                    }
                } else {
                    instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, '');
                }
            } else {
                instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, '');
            }
            
        } else {
            // For non-text-block components, remove all text-block specific placeholders
            instantiated = instantiated.replace(/\[VARIANT\]/g, '');
            instantiated = instantiated.replace(/\[DISPLAY-PARAGRAPH\]/g, 'none');
            instantiated = instantiated.replace(/\[DISPLAY-TITLE-PARAGRAPH\]/g, 'none');
            instantiated = instantiated.replace(/\[DISPLAY-QUOTE\]/g, 'none');
            instantiated = instantiated.replace(/\[DISPLAY-TITLE-ONLY\]/g, 'none');
            instantiated = instantiated.replace(/\[QUOTE-TEXT\]/g, '');
            instantiated = instantiated.replace(/\[QUOTE-AUTHOR\]/g, '');
            instantiated = instantiated.replace(/\[TITLE-TEXT\]/g, '');
        }

        return instantiated;
    }

    // Find all component placeholders and load them
    async function loadAllComponents() {
        const componentElements = document.querySelectorAll('[data-component]');
        
        for (const element of componentElements) {
            const componentName = element.getAttribute('data-component');
            const html = await loadComponent(componentName);
            
            if (html) {
                const instantiated = instantiateComponent(html, element);
                element.innerHTML = instantiated;
                
                // Re-run any scripts that were in the component
                const scripts = element.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            } else {
                element.innerHTML = `<p style="color: red;">Component "${componentName}" not found</p>`;
            }
        }
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
})();

