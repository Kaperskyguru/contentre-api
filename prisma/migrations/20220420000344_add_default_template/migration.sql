do $$
  declare

    isAvailable boolean;

    begin   
        isAvailable := (SELECT CASE WHEN "id" IS NOT NULL THEN true ELSE false END FROM "Template" WHERE "title" = 'Blank' );

        CASE WHEN isAvailable = true THEN 

        ELSE
            INSERT INTO "Template" ("title","content", "visibility") VALUES ('Blank', '<h1>Blank</h1>', CAST('PUBLIC' AS "Visibility"));
        END CASE;
    end;
$$;