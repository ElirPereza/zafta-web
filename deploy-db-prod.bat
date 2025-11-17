@echo off
set DATABASE_URL=postgresql://postgres:ZAFTACOL2025%%3F@db.mepbpnfghvmmycbqhbfy.supabase.co:5432/postgres
bunx prisma db push --skip-generate
