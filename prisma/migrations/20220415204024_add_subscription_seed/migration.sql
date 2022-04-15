INSERT INTO "Subscription" ("name") VALUES ('free'), ('basic'), ('pro'),('team');

do $$
  declare
    subscriptionRecord record;
  begin
    for subscriptionRecord in
      select * from "Subscription"
    loop
      INSERT INTO "Feature" ("subscriptionId","feature", "value")
        SELECT s."id" "subscriptionId", features "feature", featureValues "value" FROM "Subscription" s,
            UNNEST(ARRAY[
            'TOTAL_CONTENTS'
            ]) as features, 
            
            UNNEST(ARRAY[
            '12', '100', 'unlimited','unlimited'
            ]) as featureValues
        WHERE s."name" = subscriptionRecord.name;
    
    end loop;
  end;
$$;

UPDATE "User" u SET "subscriptionId" = (
    SELECT s."id" "subscriptionId" FROM "Subscription" s WHERE s."name" = 'team'
)
WHERE u."email" IN ('solomoneseme@gmail.com', 'test@test.com', 'kaperskyguru@gmail.com');
