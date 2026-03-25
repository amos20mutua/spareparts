create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  show_on_homepage boolean not null default false,
  homepage_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year text,
  condition text not null default 'New' check (condition in ('New', 'Used', 'Refurbished')),
  price numeric(12,2),
  price_visible boolean not null default true,
  stock_status text not null default 'In Stock' check (stock_status in ('In Stock', 'Low Stock', 'Out of Stock')),
  featured boolean not null default false,
  is_active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.part_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year text,
  part_needed text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'pending', 'handled', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text,
  customer_email text,
  customer_session_id text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'owner')),
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'Simon Spare Parts',
  tagline text not null default 'Find the right part fast',
  logo_url text,
  favicon_url text,
  contact_phone text not null default '+254 712 345 678',
  whatsapp_number text not null default '254712345678',
  email text not null default 'hello@simonspareparts.co.ke',
  location text not null default 'Kirinyaga Road, Nairobi, Kenya',
  opening_hours jsonb not null default '["Mon - Fri: 8:00 AM - 6:00 PM","Saturday: 8:30 AM - 4:30 PM","Sunday: By appointment"]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_settings (
  id integer primary key default 1 check (id = 1),
  hero_heading text not null default 'Find the right part fast',
  hero_subheading text not null default 'Search by part or vehicle. Check stock. Request help in minutes.',
  hero_background_image text,
  search_placeholder text not null default 'Toyota Fielder brake pads',
  primary_cta_text text not null default 'Browse Parts',
  secondary_cta_text text not null default 'Request a Part',
  trust_items jsonb not null default '["Genuine and aftermarket options","Fitment guidance","Fast WhatsApp replies","Pickup or delivery"]'::jsonb,
  featured_product_ids uuid[] not null default '{}',
  show_trust_strip boolean not null default true,
  show_featured_products boolean not null default true,
  show_bottom_cta boolean not null default true,
  bottom_cta_heading text not null default 'Can''t find it? Send the vehicle details.',
  bottom_cta_subtext text not null default 'Best for price checks, fitment help, and parts not yet listed.',
  updated_at timestamptz not null default now()
);

create table if not exists public.footer_settings (
  id integer primary key default 1 check (id = 1),
  description text not null default 'Spare parts for common service and repair jobs, with quick stock checks and fitment help.',
  show_quick_links boolean not null default true,
  phone text not null default '+254 712 345 678',
  email text not null default 'hello@simonspareparts.co.ke',
  address text not null default 'Kirinyaga Road, Nairobi, Kenya',
  business_hours jsonb not null default '["Mon - Fri: 8:00 AM - 6:00 PM","Saturday: 8:30 AM - 4:30 PM","Sunday: By appointment"]'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists parts_set_updated_at on public.parts;
create trigger parts_set_updated_at
before update on public.parts
for each row
execute function public.set_updated_at();

drop trigger if exists chat_conversations_set_updated_at on public.chat_conversations;
create trigger chat_conversations_set_updated_at
before update on public.chat_conversations
for each row
execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists homepage_settings_set_updated_at on public.homepage_settings;
create trigger homepage_settings_set_updated_at
before update on public.homepage_settings
for each row
execute function public.set_updated_at();

drop trigger if exists footer_settings_set_updated_at on public.footer_settings;
create trigger footer_settings_set_updated_at
before update on public.footer_settings
for each row
execute function public.set_updated_at();

create index if not exists parts_category_id_idx on public.parts(category_id);
create index if not exists parts_featured_idx on public.parts(featured);
create index if not exists parts_stock_status_idx on public.parts(stock_status);
create index if not exists parts_vehicle_make_idx on public.parts(vehicle_make);
create index if not exists parts_slug_idx on public.parts(slug);
create index if not exists categories_homepage_order_idx on public.categories(homepage_order);
create index if not exists chat_conversations_session_idx on public.chat_conversations(customer_session_id);
create index if not exists chat_conversations_updated_at_idx on public.chat_conversations(updated_at desc);
create index if not exists chat_messages_conversation_id_idx on public.chat_messages(conversation_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at desc);

alter table public.categories enable row level security;
alter table public.parts enable row level security;
alter table public.part_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_settings enable row level security;
alter table public.footer_settings enable row level security;

create policy "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Public can read parts"
on public.parts
for select
to anon, authenticated
using (true);

create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "Public can read homepage settings"
on public.homepage_settings
for select
to anon, authenticated
using (true);

create policy "Public can read footer settings"
on public.footer_settings
for select
to anon, authenticated
using (true);

create policy "Public can insert part requests"
on public.part_requests
for insert
to anon, authenticated
with check (true);

create policy "Public can insert contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "Authenticated can read part requests"
on public.part_requests
for select
to authenticated
using (true);

create policy "Authenticated can read contact messages"
on public.contact_messages
for select
to authenticated
using (true);

create policy "Authenticated can manage categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage parts"
on public.parts
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage homepage settings"
on public.homepage_settings
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage footer settings"
on public.footer_settings
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage chat conversations"
on public.chat_conversations
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated can manage chat messages"
on public.chat_messages
for all
to authenticated
using (true)
with check (true);

create policy "Public can create chat conversations"
on public.chat_conversations
for insert
to anon
with check (status = 'open');

create policy "Public can read chat conversations"
on public.chat_conversations
for select
to anon
using (true);

create policy "Public can update chat conversations"
on public.chat_conversations
for update
to anon
using (true)
with check (true);

create policy "Public can insert chat messages"
on public.chat_messages
for insert
to anon
with check (sender_type = 'customer');

create policy "Public can read chat messages"
on public.chat_messages
for select
to anon
using (true);

create policy "Public can update read state on owner replies"
on public.chat_messages
for update
to anon
using (sender_type = 'owner')
with check (sender_type = 'owner');

-- Recommended hardening:
-- 1. Replace the broad authenticated policies above with checks against a dedicated admin_users table
--    or auth.jwt() claims once you add role management.
-- 2. Create a public storage bucket named `part-images`.
-- 3. Create a public storage bucket named `site-media`.
-- 4. Restrict storage uploads and deletes to authenticated admins only.
-- 5. For production chat security, prefer either:
--    a) Supabase anonymous auth so each visitor has auth.uid()-scoped policies, or
--    b) Edge Functions / RPC wrappers that validate customer_session_id server-side.
--    This MVP stores a randomized customer_session_id locally and always filters by it.
--    Because the public widget reads directly from Supabase with the anon key, the chat
--    select policies above are intentionally permissive for MVP speed, not maximum security.
-- 6. Enable Realtime replication for public.chat_conversations and public.chat_messages.
