
-- Update Feature table with PlanID and remove SubscriptionID

UPDATE "Feature" SET "value" = 'unlimited' WHERE "feature" = 'TOTAL_CONTENTS' AND "value" = CAST('100' AS VARCHAR);

UPDATE "Feature" SET "value" = 'unlimited' WHERE "feature" = 'TOTAL_CONTENTS' AND "value" = 'unlimited';

DELETE FROM "Feature" WHERE "planId" = NULL;
DELETE FROM "Subscription" WHERE "planId" = NULL;
