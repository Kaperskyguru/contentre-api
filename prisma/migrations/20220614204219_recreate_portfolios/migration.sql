do $$
  declare
    isAvailable boolean;
    userRecord record;
    userTemplateId varchar(36);
    templateId varchar(36);

    begin
        for userRecord in
            select * from "User"
    loop  
        isAvailable := (SELECT CASE WHEN "id" IS NOT NULL THEN true ELSE false END FROM "Portfolio" WHERE "userId" = userRecord."id" limit 1);
        
        CASE WHEN isAvailable = true THEN 
        ELSE
            templateId := (SELECT "id" FROM "Template" WHERE "title" = 'Blank');
            INSERT INTO "UserTemplate" ("content",  "templateId", "createdAt", "updatedAt") VALUES ('<h1>Blank</h1>', templateId,  NOW(), NOW()) RETURNING id INTO userTemplateId;
            INSERT INTO "Portfolio" ("title","description", "url", "userId", "templateId", "createdAt", "updatedAt") VALUES ('Default Portfolio', 'This is your default portfolio', userRecord."portfolioURL", userRecord."id", userTemplateId, NOW(), NOW());
        END CASE;
       end loop;
    end;
$$;