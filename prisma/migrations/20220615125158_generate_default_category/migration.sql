do $$
  declare
    userRecord record;
  begin
    for userRecord in
      select * from "User"
    loop
    
    -- Create a Uncategorized category for each user/team
    INSERT INTO "Category" ("name","userId","teamId", "createdAt", "updatedAt") VALUES (
        'Uncategorized',
         userRecord.id,
         userRecord."activeTeamId",
        NOW(),
        NOW()
      ) WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name"='Uncategorized');
  
    end loop;
  end;
$$;
