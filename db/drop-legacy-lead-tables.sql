-- Manual, one-time: drop the old per-funnel lead tables AFTER `npm run db:migrate` copied their
-- rows into tool_leads (sources raio-x-2026, unicornio, raio-x-scorecard).
-- Check first, in the Neon SQL editor:
--   select tool, count(*) from tool_leads where tool in ('raio-x-2026', 'unicornio', 'raio-x-scorecard') group by tool;
--   select 'raiox_leads', count(*) from raiox_leads union all
--   select 'unicornio_leads', count(*) from unicornio_leads union all
--   select 'raio_x_scorecard_leads', count(*) from raio_x_scorecard_leads;
-- The counts must match. Then run:
drop table if exists raiox_leads;
drop table if exists unicornio_leads;
drop table if exists raio_x_scorecard_leads;
