
delete from "Feature";
delete from "Subscription";

INSERT INTO "Subscription" ("name") VALUES ('free'), ('basic'), ('pro'),('team');

do $$
  declare
    isExisting boolean;
   v boolean;
    subscriptionRecord record;
    m   varchar[];
   	arr varchar[] := ARRAY[
		['TOTAL_CONTENTS','12'],
        ['TOTAL_CONTENTS','100'],
        ['TOTAL_CONTENTS','1000'],
        ['TOTAL_CONTENTS','unlimited']
       ];
  begin
    for subscriptionRecord in
      select * from "Subscription"
    loop
        FOREACH m SLICE 1 IN ARRAY arr
            loop
        
                isExisting := (SELECT CASE WHEN "subscriptionId" IS NOT NULL THEN true ELSE false END FROM "Feature" WHERE "subscriptionId" = subscriptionRecord.id limit 1);
                v := (SELECT CASE WHEN "value" IS not NULL THEN true ELSE false END FROM "Feature" WHERE value = cast(m[2] as varchar) limit 1);

                CASE WHEN isExisting = true or v = true THEN 
                    
                ELSE
                    INSERT INTO "Feature" ("subscriptionId","feature", "value")
                    SELECT subscriptionRecord.id, m[1], m[2];
                END CASE;
            END LOOP;
    end loop;
  end;
$$;

UPDATE "User" u SET "subscriptionId" = (
    SELECT s."id" "subscriptionId" FROM "Subscription" s WHERE s."name" = 'team'
)
WHERE u."email" IN ('solomoneseme@gmail.com', 'test@test.com', 'kaperskyguru@gmail.com');
