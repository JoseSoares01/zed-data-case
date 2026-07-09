
create or replace function public.grant_admin_for_janyel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'janyelrodrigues@hotmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_grant_janyel on auth.users;
create trigger on_auth_user_created_grant_janyel
after insert on auth.users
for each row execute function public.grant_admin_for_janyel();

drop trigger if exists on_auth_user_confirmed_grant_janyel on auth.users;
create trigger on_auth_user_confirmed_grant_janyel
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_admin_for_janyel();

-- also apply retroactively if the user already exists
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users
where lower(email) = 'janyelrodrigues@hotmail.com' and email_confirmed_at is not null
on conflict (user_id, role) do nothing;
