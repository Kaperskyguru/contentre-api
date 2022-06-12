
-- Update Feature table with PlanID and remove SubscriptionID

DELETE FROM "Feature" WHERE "planId" IS NULL;
DELETE FROM "Subscription" WHERE "planId" IS NULL;
