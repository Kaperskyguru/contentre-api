do $$
  declare
    userRecord record;
    planId varchar;
   planName varchar;
  begin
    for userRecord in
      select * from "User"
    loop
   
      planName  :=(SELECT p."name" "planName" FROM "Subscription" s JOIN "Plan" p ON s."planId" = p."id" WHERE s."id" = userRecord."subscriptionId" limit 1);
     planId  :=(SELECT p."id" "planId" FROM "Subscription" s JOIN "Plan" p ON s."planId" = p."id" WHERE s."id" = userRecord."subscriptionId" limit 1);
 
      INSERT INTO "Subscription" ("name","userId","teamId","planId") VALUES (
         planName,
         userRecord.id,
         userRecord."activeTeamId",
         planId
      );

      UPDATE "User" SET "activeSubscriptionId" = userRecord."subscriptionId" WHERE id  = userRecord.id;
      UPDATE "Team" SET "activeSubscriptionId" = userRecord."subscriptionId" WHERE id  = userRecord."activeTeamId";
    end loop;
  end;
$$;

DELETE FROM "Subscription" WHERE "userId" IS NULL AND "teamId" IS NULL;