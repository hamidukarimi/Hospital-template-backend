-- Point appointment-related CMS CTAs at the new booking page (additive, safe)
UPDATE "HeroSection"
SET "buttonUrl" = '/book-appointment'
WHERE "buttonText" ILIKE '%appointment%'
  AND ("buttonUrl" = '/contact' OR "buttonUrl" IS NULL OR "buttonUrl" = '');

UPDATE "HelpCard"
SET "buttonUrl" = '/book-appointment'
WHERE ("title" ILIKE '%appointment%' OR "buttonText" ILIKE '%book%')
  AND "buttonUrl" = '/contact';

UPDATE "About"
SET "ctaButtonUrl" = '/book-appointment'
WHERE "ctaButtonUrl" = '/contact'
  AND ("ctaButtonText" ILIKE '%appointment%' OR "ctaButtonText" IS NULL);

UPDATE "FooterLink"
SET "url" = '/book-appointment'
WHERE "label" ILIKE '%appointment%'
  AND "url" = '/contact';

UPDATE "DropdownItem"
SET "url" = '/book-appointment'
WHERE "label" ILIKE '%appointment%'
  AND "url" = '/contact';

UPDATE "NavigationItem"
SET "url" = '/book-appointment'
WHERE "label" ILIKE '%appointment%'
  AND "url" = '/contact';
