
    INSERT INTO "Feature" ("planId", "feature", "value", "createdAt", "updatedAt") 
      SELECT "id" "planId", 'TOTAL_PORTFOLIOS', CAST('2' AS VARCHAR), NOW(), NOW() FROM "Plan" WHERE name = 'Basic';

    INSERT INTO "Feature" ("planId", "feature", "value", "createdAt", "updatedAt") 
      SELECT "id" "planId", 'TOTAL_PORTFOLIOS', 'unlimited', NOW(), NOW() FROM "Plan" WHERE name = 'Premium Monthly';

    INSERT INTO "Feature" ("planId", "feature", "value", "createdAt", "updatedAt") 
      SELECT "id" "planId", 'TOTAL_PORTFOLIOS', 'unlimited', NOW(), NOW() FROM "Plan" WHERE name = 'Premium Yearly';

