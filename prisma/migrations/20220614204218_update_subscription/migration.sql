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
   
      planName  :=(SELECT "name" "planName" FROM "Subscription"  WHERE "id" = userRecord."activeSubscriptionId" limit 1);
     planId  :=(SELECT "id" "planId" FROM "Plan" WHERE "name" = planName limit 1);

      UPDATE "Subscription" SET "planId" = planId  WHERE "id" = userRecord."activeSubscriptionId";

    end loop;
  end;
$$;
