# Fazle Rabbi Zaki - Aerospace Engineer Portfolio

A modern, responsive portfolio website showcasing aerospace engineering projects, technical expertise, and professional experience.

## Features

- **Modern Design**: Clean, minimal interface with dark/light mode toggle
- **Responsive**: Mobile-first design that works perfectly on all devices
- **Fast Performance**: Optimized for Lighthouse scores and accessibility
- **Interactive Projects**: Detailed project showcases with galleries, metrics, and case studies
- **Data-Driven**: Centralized project data in JSON with markdown content support
- **SEO Optimized**: Complete meta tags, OpenGraph, sitemap, and robots.txt
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **PWA Support**: Progressive Web App manifest for installable experience

## Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── project.html            # Project detail page template
├── js/
│   ├── main.js             # Core portfolio functionality
│   └── project.js          # Project page specific features
├── data/
│   └── projects.json       # Centralized project data and metadata
├── content/
│   └── projects/           # Detailed project documentation
│       ├── adcs.md         # CubeSat ADCS project
│       ├── airpuck.md      # Air Puck Titan project
│       ├── heliophysics.md # Heliophysics Science Observer
│       ├── hovercraft.md   # Hovercraft project
│       └── wind.md         # Wind generator project
├── images/                 # All project images (flat structure)
│   ├── fazle_headshot.jpg  # Profile photo
│   ├── adcs_*.jpg          # CubeSat ADCS images
│   ├── airpuck_*.png       # Air Puck images
│   ├── hovercraft_*.png    # Hovercraft images
│   └── wind_*.png          # Wind generator images
├── reports/                # PDF reports and documents
├── resume.pdf              # Resume PDF file
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine crawler rules
├── manifest.json           # PWA manifest
├── .nojekyll               # GitHub Pages Jekyll disable flag
├── DEPLOYMENT.md           # Deployment documentation
└── README.md               # This file
```

## Featured Projects

1. **Heliophysics Science Observer & Communications Platform**
   - NASA mission design for space weather monitoring
   - Role: Spacecraft Systems Design | Winter 2026

2. **CubeSat ADCS Imaging Testbed (1U)**
   - Attitude determination and control systems development
   - Role: ADCS & Systems Engineer | 2025-Present

3. **Air Puck Prototype for Titan**
   - CAD/CFD optimization for Titan exploration vehicle
   - Role: Design, CFD, Test | 2023

4. **Hovercraft Prototype & Competition**
   - Competition vehicle with advanced flow modeling
   - Role: Assembly, Testing, CFD | 2023

5. **Wind-Powered Generator for Rural Guatemala**
   - Low-cost renewable energy prototype
   - Role: ME Design, Test, Data | 2024

## Setup Instructions

### 1. Add Your Content

#### Images
Place project images in the `/images/` directory using the naming convention:
- `{project-slug}_hero.{jpg|png}` - Main project image
- `{project-slug}_{description}.{jpg|png}` - Additional project images

Example: `adcs_hero.jpg`, `hovercraft_dims.png`

#### Project Content
Create or edit markdown files in `/content/projects/`:
- Use the project slug as the filename (e.g., `adcs.md`)
- Include detailed project description, methods, and outcomes

#### Resume
- Place your resume PDF at `/resume.pdf`
- The website will automatically detect and display it

#### Reports
- Place project reports in `/reports/`
- Update links in `data/projects.json` accordingly

### 2. Customize Content

Edit `data/projects.json` to update:
- Owner/portfolio metadata (name, photo, links)
- Project details: slug, title, role, date, location
- Metrics and technical specifications
- Image paths and gallery references
- Tags and categorization

### 3. Update Personal Information

In `data/projects.json`, update the owner section:
- Name and tagline
- Profile photo path
- Contact email
- GitHub and LinkedIn URLs
- About section content

## Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your site will be available at `https://username.github.io/repository-name`

Note: The `.nojekyll` file ensures proper deployment without Jekyll processing.

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to empty (static site)
3. Set publish directory to `.` (root)
4. Deploy automatically on every push

See `DEPLOYMENT.md` for detailed deployment instructions.

## Customization

### Colors and Styling
The website uses Tailwind CSS with a custom color scheme. To modify:
- Edit the `tailwind.config` section in `index.html`
- Update CSS custom properties in the `<style>` section

### Adding New Projects
1. Add project entry to `data/projects.json` with all metadata
2. Create a markdown file in `/content/projects/{slug}.md`
3. Add project images to `/images/` with appropriate naming
4. Update gallery references in the project data

### Modifying Navigation
Update the navigation links in the `<nav>` section of `index.html` to match your sections.

## Mobile Optimization

The website is fully responsive and includes:
- Mobile-first CSS design
- Touch-friendly navigation
- Optimized images and loading
- Progressive Web App features

## SEO Features

- Complete meta tags and OpenGraph images
- Structured data markup
- XML sitemap (`sitemap.xml`)
- Robots configuration (`robots.txt`)
- Semantic HTML structure
- Fast loading times

## Testing

### Performance Testing
- Use Google PageSpeed Insights
- Test with Lighthouse in Chrome DevTools
- Verify mobile responsiveness

### Accessibility Testing
- Use WAVE Web Accessibility Evaluator
- Test with screen readers
- Verify keyboard navigation

## Support

For questions or issues:
- Email: jakiuddin012@gmail.com
- LinkedIn: [linkedin.com/in/jakiuddin](https://linkedin.com/in/jakiuddin)
- GitHub: [github.com/jakiu012](https://github.com/jakiu012)

## License

This portfolio template is open source and available under the MIT License.

---

Built for aerospace engineering professionals.
