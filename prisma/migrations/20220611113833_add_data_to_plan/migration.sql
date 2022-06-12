
INSERT INTO "Plan" ("name","createdAt", "updatedAt") VALUES 
(
    'Basic',
    NOW(),
    NOW()
),
(
    'Premium',
    NOW(),
    NOW()
),
(
    'Team',
    NOW(),
    NOW()
);

-- Update Subscription with right data

UPDATE "Subscription" SET "planId" = (
    SELECT "id" "planId" FROM "Plan" WHERE "name" = 'Basic'
), "name" = 'Basic'
WHERE "name" = 'free';

UPDATE "Subscription" SET "planId" = (
    SELECT "id" "planId" FROM "Plan" WHERE "name" = 'Premium'
), "name" = 'Premium'
WHERE "name" = 'pro';

UPDATE "Subscription" SET "planId" = (
    SELECT "id" "planId" FROM "Plan" WHERE "name" = 'Team'
), "name" = 'Team'
WHERE "name" = 'team';


-- Update Feature table with PlanID and remove SubscriptionID

UPDATE "Feature" SET "planId" = (
    SELECT p."id" "id" FROM "Plan" p WHERE p."name" = 'Basic'
)
WHERE "feature" = 'TOTAL_CONTENTS' AND "value" = CAST('12' AS VARCHAR);

UPDATE "Feature" SET "planId" = (
    SELECT p."id" "id" FROM "Plan" p WHERE p."name" = 'Premium'
)
WHERE "feature" = 'TOTAL_CONTENTS' AND "value" = CAST('100' AS VARCHAR);

UPDATE "Feature" SET "planId" = (
    SELECT p."id" "id" FROM "Plan" p WHERE p."name" = 'Team'
)
WHERE "feature" = 'TOTAL_CONTENTS' AND "value" = 'unlimited';



