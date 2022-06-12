
INSERT INTO "Template" ("title","slug","content","type","visibility","createdAt", "updatedAt") VALUES (
    'CUSTOMIZE',
    'Customize',
    '<h1>Customized</h1>',
    CAST('CUSTOMIZED' AS "TemplateType"),
    CAST('PUBLIC' AS "Visibility"),
    NOW(),
    NOW()
)