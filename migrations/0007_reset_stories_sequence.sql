-- Reset stories sequence to start after the highest id
SELECT setval('stories_id_seq', COALESCE((SELECT MAX(id) FROM stories), 0), true);