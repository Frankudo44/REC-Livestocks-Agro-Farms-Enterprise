-- ============================================================
-- SAMPLE TESTIMONIALS — run once in the Supabase SQL editor (idempotent).
-- Removes all seeded sample testimonials from the live site.
-- The testimonials section stays in place: it will show
-- "Testimonials will appear here soon." until real testimonials
-- are added and published from Admin → Testimonials.
-- ============================================================

delete from public.testimonials
where sample = true
   or message ilike 'Sample testimonial%';
