do $$
  declare
    userRecord record;

begin
    for userRecord in
      select
	*
from
	"User"
    loop
	-- Create a Uncategorized category for each user/team
    insert
	into
	"Category" ("name",
	"userId",
	"teamId",
	"createdAt",
	"updatedAt") 
    select
	'Uncategorized',
	userRecord.id,
	userRecord."activeTeamId",
	NOW(),
	NOW()
from
	"Content"
where
	not exists (
	select
		1
	from
		"Category"
	where
		"name" = 'Uncategorized');
end loop;
end;

$$;
