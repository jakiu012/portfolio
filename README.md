# Jaki (Night Wolfe) Uddin - Aerospace Engineer Portfolio

A modern, responsive portfolio website showcasing aerospace engineering projects, technical expertise, and professional experience.

## 🚀 Features

- **Modern Design**: Clean, minimal interface with dark/light mode toggle
- **Responsive**: Mobile-first design that works perfectly on all devices
- **Fast Performance**: Optimized for Lighthouse scores and accessibility
- **Interactive Projects**: Detailed project showcases with galleries, metrics, and case studies
- **SEO Optimized**: Complete meta tags, OpenGraph, and sitemap
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 📁 Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── js/
│   └── main.js            # JavaScript functionality
├── data/
│   └── projects.json      # Project data and content
├── images/                # Project images and assets
│   ├── adcs/             # CubeSat ADCS project images
│   ├── air-puck/         # Air Puck Titan project images
│   ├── hovercraft/       # Hovercraft project images
│   ├── wind-turbine/     # Wind generator project images
│   └── Jafrul_Amin.jpg   # Profile photo
├── reports/              # PDF reports and documents
│   ├── space584_adcs.pdf
│   ├── air_puck.pdf
│   ├── hovercraft.pdf
│   └── wind_generator.pdf
├── resume.pdf            # Resume PDF file
├── sitemap.xml           # SEO sitemap
├── manifest.json         # PWA manifest
└── README.md            # This file
```

## 🛠️ Setup Instructions

### 1. Add Your Content

#### Images
Place your project images in the appropriate folders:
- `/images/adcs/` - CubeSat ADCS project images
- `/images/air-puck/` - Air Puck Titan project images  
- `/images/hovercraft/` - Hovercraft project images
- `/images/wind-turbine/` - Wind generator project images

#### Resume
- Place your resume PDF at `/resume.pdf`
- The website will automatically detect and display it

#### Reports
- Place your project reports in `/reports/`
- Update the links in `data/projects.json` to match your file names

### 2. Customize Content

Edit `data/projects.json` to update:
- Project details and descriptions
- Metrics and technical specifications
- Image paths and gallery captions
- Report links and external URLs

### 3. Update Personal Information

In `index.html`, update:
- Contact email addresses
- Social media links (LinkedIn, GitHub)
- Personal bio and skills
- Project dates and locations

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your site will be available at `https://username.github.io/repository-name`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to empty (static site)
3. Set publish directory to `.` (root)
4. Deploy automatically on every push

## 🎨 Customization

### Colors and Styling
The website uses Tailwind CSS with a custom color scheme. To modify:
- Edit the `tailwind.config` section in `index.html`
- Update CSS custom properties in the `<style>` section

### Adding New Projects
1. Add project data to `data/projects.json`
2. Create corresponding image folders
3. Add project images with descriptive filenames
4. Update gallery paths in the project data

### Modifying Navigation
Update the navigation links in the `<nav>` section of `index.html` to match your sections.

## 📱 Mobile Optimization

The website is fully responsive and includes:
- Mobile-first CSS design
- Touch-friendly navigation
- Optimized images and loading
- Progressive Web App features

## 🔍 SEO Features

- Complete meta tags and OpenGraph images
- Structured data markup
- XML sitemap
- Semantic HTML structure
- Fast loading times

## 🧪 Testing

### Performance Testing
- Use Google PageSpeed Insights
- Test with Lighthouse in Chrome DevTools
- Verify mobile responsiveness

### Accessibility Testing
- Use WAVE Web Accessibility Evaluator
- Test with screen readers
- Verify keyboard navigation

## 📞 Support

For questions or issues:
- Email: jaki.uddin@colorado.edu
- LinkedIn: [linkedin.com/in/jakiuddin](https://linkedin.com/in/jakiuddin)
- GitHub: [github.com/jakiuddin](https://github.com/jakiuddin)

## 📄 License

This portfolio template is open source and available under the MIT License.

---

Built with ❤️ for aerospace engineering professionals.