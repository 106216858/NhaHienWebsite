# Nhã Hiên

A website concept for **Nhã Hiên**, a lifestyle and experience centre for adults in Ho Chi Minh City, built for the **SwinBiz competition** at Swinburne University of Technology.

The site is the digital face of our business proposal. It shows how Nhã Hiên would present itself to customers and partners: what it offers, why it exists and how people can get involved.

> This is a competition prototype. The business, partners, programmes and membership details are proposed concepts, not a live operation.

## About the business

Nhã Hiên takes its name from the Vietnamese *mái hiên*, the shaded porch or awning that gives people a place to pause, gather and feel at home. The idea is a welcoming space where life after retirement is treated as a new chapter, not an ending.

- **Philosophy:** "Beyond retirement. Into a life of possibilities." Meaningful experiences do not belong to any particular age.
- **What we offer:** curated experiences in arts, cooking and baking, culture and tea, movement, social games and floral design.
- **Who it is for:** adults who want to learn, stay active and meet like-minded people in a comfortable, personalised setting.
- **How people join:** a single session or a 1-, 3-, 6- or 12-month membership.
- **Who we work with:** a proposed network of artisans, specialists and trusted organisations across culture, accessibility and design, wellbeing and safety, culinary and materials, and professional services.

## About the website

A multi-page static website designed to feel calm, warm and premium, with a forest green, ivory and gold palette and Cormorant Garamond and Source Sans 3 typography.

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Brand introduction, experience highlights, community, membership overview |
| Experiences | `experience.html` | Filterable, paged list of activities, each linking to an enquiry |
| Our Story | `story.html` | Philosophy, the meaning of the name, and the Nhã Hiên experience |
| Membership | `membership.html` | Membership options |
| Membership details | `membership-detail.html` | Plan details and eligibility |
| Our Partners | `partner.html` | The proposed partner network, with search and category filters |
| Enquire | `booking.html` | Enquiry form for activities and memberships |

## Tech

Plain **HTML, CSS and JavaScript** with no frameworks and no build step.

```
*.html             Pages stay at the repository root for GitHub Pages
assets/css/        Shared and membership-detail stylesheets
assets/js/         Shared and page-specific behaviour
img/               Brand, social, home, experience, membership and partner images
tools/rearrange.py Optional image-path maintenance helper
favicon.ico        Root favicon for browsers
```

Preview image-path maintenance with `python tools/rearrange.py --dry-run` before applying it.

## Deploy with GitHub Pages

1. Make sure `index.html` is at the top level of the repository.
2. Push to GitHub.
3. Go to **Settings**, then **Pages**. Set the source to **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
4. After a minute or two the site is live at `https://<username>.github.io/<repository>/`.

File names are case-sensitive on GitHub, so image paths must match exactly.

## Limitations

- The enquiry form and the footer email form do not send data anywhere yet. They need a backend or a form service, and the checks in `assets/js/booking.js` must be repeated on the server.
- Partner cards, pricing and some copy are placeholders for the competition.