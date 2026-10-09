-- ============================================================
-- PRODUCT REVIEWS — run once in the Supabase SQL editor (idempotent).
-- Enables customers to edit their own review (re-enters moderation)
-- and enforces one review per customer per product.
--   1) products get updated_at-style stamp on reviews
--   2) unique (product_id, user_id)
--   3) owner may UPDATE their own row only with approved = false
--      (so an edited review is re-checked by an admin)
-- ============================================================

alter table public.product_reviews
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists idx_reviews_product_user
  on public.product_reviews(product_id, user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_reviews_touch on public.product_reviews;
create trigger trg_reviews_touch before update on public.product_reviews
  for each row execute function public.touch_updated_at();

drop policy if exists "reviews_update_admin" on public.product_reviews;
drop policy if exists "reviews_update_own_or_admin" on public.product_reviews;
create policy "reviews_update_own_or_admin" on public.product_reviews
  for update using (public.is_admin() or auth.uid() = user_id)
  with check (
    public.is_admin()
    or (auth.uid() = user_id and approved = false)
  );
