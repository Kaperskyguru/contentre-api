do $$
  declare
    userRecord record;
  begin
    for userRecord in
      select * from "User"
    loop
    
    -- Create a Personal Notebook for each user/team
    INSERT INTO "Content" ("title", "excerpt", "userId","teamId", "content", "notebookId", "status", "createdAt", "updatedAt") 
        select "title", '', "userId", "teamId", "content", "notebookId", CAST('DRAFT' AS "StatusType"),  "createdAt", "updatedAt" from "Note" where "userId" = userRecord.id and "teamId" = userRecord."activeTeamId";
  
    end loop;
  end;
$$;
