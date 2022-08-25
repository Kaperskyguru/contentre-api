do $$
  declare
    planRecordPremium varchar;
    isAvailable boolean;
    planRecordPremiumYear varchar;

begin

planRecordPremium :=(
select
	"id"
from
	"Plan"
where
	"name" = 'Premium'
limit 1);

planRecordPremiumYear :=(
select
	"id"
from
	"Plan"
where
	"name" = 'Team'
limit 1);

isAvailable :=(
select
	CASE WHEN "id" IS NOT NULL THEN true ELSE false END 
from
	"PaymentChannel"
where
	"channel"  = 'PAYSTACK'
limit 1);

 case
	when isAvailable = true then
	else
    insert
	into
	"PaymentChannel" (
            "channel",
	"planId",
	"paymentPlanId",
	"createdAt",
	"updatedAt"
        )
values
        (
            'PAYSTACK',
            planRecordPremium,
            'PLN_pm8vah8nlzpdb5m',
            NOW(),
            NOW()
        ),
        (
            'PAYSTACK',
            planRecordPremiumYear,
            'PLN_c568t2jp8hnfm53',
            NOW(),
            NOW()
        );
        END CASE; 
end;

$$;