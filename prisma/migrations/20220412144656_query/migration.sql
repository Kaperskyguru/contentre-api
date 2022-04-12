UPDATE "Content" c SET "publishedDate" = CASE 
        WHEN c."publishedDate" IS NULL THEN c."createdAt"
        ELSE c."publishedDate"
    END
FROM "Content" co
WHERE c."id" = co."id" 