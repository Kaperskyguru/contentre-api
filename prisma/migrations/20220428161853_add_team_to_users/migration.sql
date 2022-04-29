
do $$
  declare
    userRecord record;
    teamId varchar(36);
  begin
    for userRecord in
      select * from "User"
    loop
     INSERT INTO "Team" ("name") VALUES ('Personal') RETURNING id INTO teamId;

    --   Create Member to bind User with Team
      INSERT INTO "Member" ("userId","teamId","role","createdAt", "updatedAt")
        SELECT 
            u."id" "userId", 
            teamId, 
           CAST('ADMIN' AS "MemberRole"),
            NOW(), 
            NOW()
        FROM "User" u WHERE u."id" = userRecord.id;

        -- Update User Active Team
        UPDATE "User" u SET "activeTeamId" = teamId WHERE u."id" = userRecord.id;

        -- Client
        UPDATE "Client" c SET "teamId" = teamId WHERE c."userId" = userRecord.id;

        -- Content
        UPDATE "Content" co SET "teamId" = teamId WHERE co."userId" = userRecord.id;

        -- Category
        UPDATE "Category" ca SET "teamId" = teamId WHERE ca."userId" = userRecord.id;

        -- Tag
        UPDATE "Tag" t SET "teamId" = teamId WHERE t."userId" = userRecord.id;

        -- Social
        UPDATE "Social" s SET "teamId" = teamId WHERE s."userId" = userRecord.id;
    end loop;
  end;
$$;

