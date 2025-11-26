-- First, update existing FILE fields to IMAGE temporarily
UPDATE application_fields SET type = 'TEXT' WHERE type = 'FILE';

-- Now update the enum
ALTER TYPE "FieldType" RENAME VALUE 'FILE' TO 'IMAGE';

-- Add PDF type to enum
ALTER TYPE "FieldType" ADD VALUE 'PDF';
