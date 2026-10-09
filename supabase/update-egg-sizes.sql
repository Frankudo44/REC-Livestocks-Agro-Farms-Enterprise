-- ============================================================
-- EGG SIZES — run once in the Supabase SQL editor (idempotent).
-- Splits table eggs into Large / Medium / Small crates of 30.
--   1) adds products.size (if missing)
--   2) renames the existing "Table Eggs (Crate)" to the Large size
--      (keeps its id, stock of 60 and all order history)
--   3) inserts Medium and Small crates (upsert on slug, so safe to re-run)
-- ============================================================

alter table public.products
  add column if not exists size text;

update public.products
set name = 'Table Eggs – Large (Crate)',
    description = 'Large-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.',
    size = 'Large',
    updated_at = now()
where slug = 'table-eggs-crate';

insert into public.products
  (category_id, name, slug, description, price, unit, image_url, stock_quantity,
   minimum_order_quantity, online_orderable, featured, active, size)
select c.id, v.name, v.slug, v.description, v.price, 'per crate (30)',
       coalesce(p.image_url, 'assets/images/eggs.jpg'), v.stock,
       1, true, false, true, v.size
from (values
  ('Table Eggs – Medium (Crate)', 'table-eggs-medium-crate',
   'Medium-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.',
   6000, 'Medium', 40),
  ('Table Eggs – Small (Crate)', 'table-eggs-small-crate',
   'Small-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.',
   5500, 'Small', 40)
) as v(name, slug, description, price, size, stock)
join public.categories c on c.slug = 'eggs'
left join public.products p on p.slug = 'table-eggs-crate'
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  size = excluded.size,
  stock_quantity = excluded.stock_quantity,
  updated_at = now();
