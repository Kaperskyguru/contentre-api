do $$
  declare
    userRecord record;
    planId varchar;
   planName varchar;
   subscriptionId varchar(36);
  begin
    for userRecord in
      select * from "User"
    loop
   
      planName  :=(SELECT "name" "planName" FROM "Subscription"  WHERE "id" = userRecord."subscriptionId" limit 1);
     planId  :=(SELECT "id" "planId" FROM "Subscription" WHERE "id" = userRecord."subscriptionId" limit 1);
 
      INSERT INTO "Subscription" ("name","userId","teamId","planId") VALUES (
         planName,
         userRecord.id,
         userRecord."activeTeamId",
         planId
      ) RETURNING id INTO subscriptionId;

      UPDATE "User" SET "activeSubscriptionId" = subscriptionId WHERE id  = userRecord.id;
      UPDATE "Team" SET "activeSubscriptionId" = subscriptionId WHERE id  = userRecord."activeTeamId";
    end loop;
  end;
$$;

DELETE FROM "Subscription" WHERE "userId" IS NULL AND "teamId" IS NULL;