do $$
  declare
    monthlyPlanId varchar;
    yearlyPlanId varchar;
   begin

    UPDATE "Plan" SET "name" = 'Premium Monthly' WHERE name  = 'Premium';
    UPDATE "Plan" SET "name" = 'Premium Yearly' WHERE name  = 'Team';

    monthlyPlanId  :=(SELECT "id" FROM "Plan" WHERE name = 'Premium Monthly' limit 1);
    yearlyPlanId  :=(SELECT "id" FROM "Plan" WHERE name = 'Premium Yearly' limit 1);

    INSERT INTO "PaymentChannel" ("channel", "planId", "paymentPlanId") VALUES (
         'PADDLE',
         yearlyPlanId,
         '34067'
      );

    INSERT INTO "PaymentChannel" ("channel", "planId", "paymentPlanId") VALUES (
         'PADDLE',
         monthlyPlanId,
         '34066'
      );
    end;
$$;