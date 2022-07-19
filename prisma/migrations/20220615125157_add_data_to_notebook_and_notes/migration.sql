do $$
  declare
    userRecord record;
   notebookId varchar(36);
  begin
    for userRecord in
      select * from "User"
    loop
    
    -- Create a Personal Notebook for each user/team
    INSERT INTO "Notebook" ("name","userId","teamId", "createdAt", "updatedAt") VALUES (
        'Personal Notebook',
         userRecord.id,
         userRecord."activeTeamId",
        NOW(),
        NOW()
      ) RETURNING id INTO notebookId;

      -- Select all Contents with Null Client and UserId
      INSERT INTO "Note" ("title","content","notebookId","userId","teamId","createdAt","updatedAt")
        SELECT 
          "title", 
          "content", 
          notebookId, 
          userRecord.id, 
          userRecord."activeTeamId",
          NOW(),
          NOW()
        FROM "Content"
        WHERE "clientId" IS NULL AND "userId" = userRecord.id;

    -- Delete all notes from Content table
    DELETE FROM "Content" WHERE "clientId" IS NULL AND "userId" = userRecord.id;
  
    end loop;
  end;
$$;
