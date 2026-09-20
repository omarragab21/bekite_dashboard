#!/usr/bin/env node

/**
 * Imports the API-backed content from the BeKite website data source.
 *
 * Usage:
 *   BEKITE_EMAIL=... BEKITE_PASSWORD=... node scripts/import-content-data.mjs
 *   ... --dry-run
 *
 * The importer is idempotent: records are matched by slug and updated when
 * they already exist. Every upload is recorded in import-report.json/md.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_ROOT = process.env.BEKITE_CONTENT_ROOT || '/Users/omarragab/Projects/bekite/src/data/content';
const IMAGE_ROOT = process.env.BEKITE_IMAGE_ROOT || '/Users/omarragab/Projects/bekite/dist/images';
const API_BASE = (process.env.BEKITE_API_BASE || 'https://site-backend.be-kite.com/api/v1').replace(/\/$/, '');
const EMAIL = process.env.BEKITE_EMAIL || 'admin@bekite.com';
const PASSWORD = process.env.BEKITE_PASSWORD || 'password123';
const DRY_RUN = process.argv.includes('--dry-run');
const REPORT_JSON = path.join(ROOT, 'import-report.json');
const REPORT_MD = path.join(ROOT, 'IMPORT_CONTENT_REPORT.md');

const source = (file) => pathToFileURL(path.join(CONTENT_ROOT, file)).href;
const text = (value, fallback = '') => value == null ? fallback : String(value);
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const slugify = (value) => text(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `content-${Date.now()}`;
const cleanIcon = (value) => typeof value === 'string' ? value : undefined;

const files = await Promise.all([
  import(source('projectsData.js')),
  import(source('productsData.js')),
  import(source('solutionsData.js')),
  import(source('brandsData.js')),
  import(source('careersData.js')),
]);
const [{ projectsList, projectDetailsData, projectsCategories }, { productsList, productDetailsData, productsCategories }, { solutionDetailsData }, { brandsPageData }, { activeJobsList, jobDetailsData }] = files;

const report = {
  startedAt: new Date().toISOString(),
  dryRun: DRY_RUN,
  source: { contentRoot: CONTENT_ROOT, imageRoot: IMAGE_ROOT, apiBase: API_BASE },
  totals: {},
  results: [],
  warnings: [],
};

let token = '';

async function request(endpoint, options = {}) {
  const headers = { Accept: 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const raw = await response.text();
  let body;
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw }; }
  if (!response.ok) {
    const error = new Error(`${options.method || 'GET'} ${endpoint} -> ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

async function login() {
  const form = new FormData();
  form.append('email', EMAIL);
  form.append('password', PASSWORD);
  const body = await request('/dashboard/login', { method: 'POST', body: form });
  token = body?.token || body?.data?.token || body?.access_token || '';
  if (!token) throw new Error('Login succeeded but no bearer token was returned');
}

function rows(body) {
  const value = body?.data ?? body;
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

async function getExisting(endpoint) {
  const listEndpoint = endpoint === '/dashboard/projects' ? `${endpoint}?per_page=1000` : endpoint;
  try { return rows(await request(listEndpoint)); } catch (error) {
    report.warnings.push({ endpoint: listEndpoint, message: error.message, body: error.body });
    return [];
  }
}

function imagePath(value) {
  if (!value || typeof value !== 'string' || !value.startsWith('/images/')) return null;
  return path.join(IMAGE_ROOT, value.slice('/images/'.length));
}

async function appendFile(form, field, value, fallbackName) {
  const file = imagePath(value);
  if (!file) return false;
  if (field === 'client_logo_file' && file.endsWith('.svg')) {
    report.warnings.push({ field, value, message: 'Skipped SVG client logo because the backend image validator rejects SVG for this field' });
    return false;
  }
  try {
    const data = await fs.readFile(file);
    const type = value.endsWith('.svg') ? 'image/svg+xml' : value.endsWith('.jpg') || value.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
    form.append(field, new Blob([data], { type }), path.basename(file) || fallbackName);
    return true;
  } catch {
    report.warnings.push({ field, value, message: `Local image not found: ${file}` });
    return false;
  }
}

function append(form, key, value) {
  if (value === undefined || value === null || value === '') return;
  form.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
}

function appendArray(form, key, values = []) {
  (Array.isArray(values) ? values : []).forEach((value, index) => append(form, `${key}[${index}]`, value));
}

function localized(item, lang) { return item?.[lang] || {}; }

async function projectPayload(item) {
  const en = localized(item, 'en'); const ar = localized(item, 'ar');
  const detail = projectDetailsData?.[item.slug] || {};
  const detailEn = localized(detail, 'en'); const detailAr = localized(detail, 'ar');
  const social = detailEn.socialMedia || detailAr.socialMedia || {};
  const branding = detailEn.branding || detailAr.branding || {};
  const form = new FormData();
  append(form, 'name_ar', first(ar.title, en.title, item.slug));
  append(form, 'name_en', first(en.title, ar.title, item.slug));
  append(form, 'client_name', first(en.title, ar.title));
  append(form, 'slug', item.slug);
  append(form, 'location', 'Riyadh, Saudi Arabia'); append(form, 'year', '2026');
  append(form, 'badge', first(en.badge, ar.badge, 'Portfolio Project'));
  append(form, 'accent_color', item.accentColor); append(form, 'is_active', 1);
  appendArray(form, 'tags', first(en.tags, ar.tags, []));
  appendArray(form, 'category_ids', [1]);
  append(form, 'filter_categories', (item.filterCategories || []).filter((x) => x !== 'all').join(','));
  append(form, 'description_ar', first(ar.description, en.description));
  append(form, 'description_en', first(en.description, ar.description));
  append(form, 'live_website_url', detailEn.webUi?.buttonHref || detailAr.webUi?.buttonHref);
  append(form, 'has_mobile_app', detailEn.mobileApp || detailAr.mobileApp ? 1 : 0);
  appendArray(form, 'deliverables', first(en.tags, ar.tags, []));
  const links = social.links || {};
  for (const [key, value] of Object.entries({ facebook_url: links.facebook, instagram_url: links.instagram, twitter_x_url: links.twitter, linkedin_url: links.linkedin, tiktok_url: links.tiktok, youtube_url: links.youtube })) append(form, key, value);
  await appendFile(form, 'website_showcase_image_file', first(detailEn.webUi?.image, detailAr.webUi?.image, item.image), 'website-showcase.png');
  await appendFile(form, 'mobile_app_mockup_image_file', first(detailEn.mobileApp?.image, detailAr.mobileApp?.image), 'mobile-mockup.png');
  await appendFile(form, 'client_logo_file', item.logo || detailEn.heroLogo || detailAr.heroLogo, 'client-logo.png');
  const gallery = [...(social.items || []).map((x) => ({ ...x, type: 'social' })), ...(branding.items || []).map((x) => ({ ...x, type: 'branding' }))];
  for (const [index, image] of gallery.entries()) { append(form, `images_data[${index}][title]`, image.title); append(form, `images_data[${index}][type]`, image.type); await appendFile(form, `images_data[${index}][file]`, image.image, `gallery-${index + 1}.png`); }
  return form;
}

async function productPayload(item) {
  const en = localized(item, 'en'); const ar = localized(item, 'ar'); const detail = productDetailsData?.[item.slug] || {};
  const dEn = localized(detail, 'en'); const dAr = localized(detail, 'ar'); const form = new FormData();
  append(form, 'name_ar', first(ar.title, en.title, item.slug)); append(form, 'name_en', first(en.title, ar.title, item.slug));
  append(form, 'slug', item.slug); append(form, 'category_id', 1); append(form, 'color', item.accentColor); append(form, 'is_active', 1); append(form, 'is_featured_product', 1);
  append(form, 'address_ar', 'الرياض، المملكة العربية السعودية'); append(form, 'address_en', 'Riyadh, Saudi Arabia');
  append(form, 'description_ar', first(ar.description, en.description)); append(form, 'description_en', first(en.description, ar.description));
  append(form, 'overview_paragraph1', first(dAr.overview?.paragraph1, dEn.overview?.paragraph1, ar.description, en.description)); append(form, 'overview_paragraph2', first(dEn.overview?.paragraph2, dAr.overview?.paragraph2, en.description, ar.description));
  const built = first(dEn.builtFor?.items, dAr.builtFor?.items, []); const features = first(en.features, ar.features, []);
  const builtItems = built.length ? built : [{ title: 'Modern businesses', description: 'Flexible workflows for growing teams' }];
  const featureItems = features.length ? features : [{ title: 'Unified operations', description: 'Manage the most important workflows in one place' }];
  builtItems.forEach((x, i) => { append(form, `built_for_data[${i}][title]`, typeof x === 'string' ? x : x.title); append(form, `built_for_data[${i}][description]`, typeof x === 'string' ? '' : (x.description || x.desc)); });
  featureItems.forEach((x, i) => { append(form, `what_it_does_data[${i}][title]`, typeof x === 'string' ? x : x.title); append(form, `what_it_does_data[${i}][description]`, typeof x === 'string' ? '' : (x.description || x.desc)); });
  append(form, 'built_for_main_section_title', first(dEn.builtFor?.title, dAr.builtFor?.title, 'Built for modern teams')); append(form, 'built_for_secondary_section_title', first(dEn.builtFor?.subtitle, dAr.builtFor?.subtitle, 'Flexible, secure, and ready to scale'));
  append(form, 'what_it_does_main_title', first(dEn.whatItDoes?.title, dAr.whatItDoes?.title, 'What it does')); append(form, 'what_it_does_secondary_title', first(dEn.whatItDoes?.subtitle, dAr.whatItDoes?.subtitle, 'Everything your team needs in one platform'));
  await appendFile(form, 'overview_tablet_image_file', first(detail.overviewImage, item.image), 'product-overview.png'); await appendFile(form, 'see_in_action_main_image_file', detail.actionMainImage, 'product-action-main.png');
  const screens = detail.actionScreens || [];
  const screenNames = ['one', 'two', 'three'];
  for (let index = 0; index < 3; index += 1) { const n = screenNames[index]; const screen = screens[index] || {}; append(form, `see_in_action_screen_${n}_title_ar`, first(screen.titleAr, screen.title, `الشاشة ${index + 1}`)); append(form, `see_in_action_screen_${n}_title_en`, first(screen.titleEn, screen.title, `Screen ${index + 1}`)); await appendFile(form, `see_in_action_screen_${n}_file`, screen.image, `product-screen-${index + 1}.png`); }
  append(form, 'how_it_works_data[0][title]', first(dEn.howItWorks?.steps?.[0]?.title, dAr.howItWorks?.steps?.[0]?.title, 'Setup'));
  append(form, 'how_it_works_data[0][description]', first(dEn.howItWorks?.steps?.[0]?.description, dAr.howItWorks?.steps?.[0]?.description, 'Configure the platform and start working'));
  append(form, 'why_teams_data[0][title]', first(dEn.whyTeams?.items?.[0]?.title, dAr.whyTeams?.items?.[0]?.title, 'Reliable operations'));
  append(form, 'why_teams_data[0][description]', first(dEn.whyTeams?.items?.[0]?.description, dAr.whyTeams?.items?.[0]?.description, 'Built for dependable daily work'));
  append(form, 'scalability_tiers[0][title]', 'Standard'); append(form, 'scalability_tiers[0][advantage]', 'Flexible growth'); append(form, 'scalability_tiers[0][specifications_capacity]', 'Ready for expanding teams');
  append(form, 'packages[0][name]', 'Standard Edition'); append(form, 'packages[0][description]', 'Core platform capabilities');
  if (process.argv.includes('--debug-product')) console.log(item.slug, [...form.entries()].filter(([key]) => key.includes('built_for') || key.includes('see_in_action')) .map(([key, value]) => [key, typeof value === 'string' ? value : value.name]));
  return form;
}

async function solutionPayload(slug, detail) {
  const en = localized(detail, 'en'); const ar = localized(detail, 'ar'); const form = new FormData();
  append(form, 'title_ar', first(ar.title, en.title, slug)); append(form, 'title_en', first(en.title, ar.title, slug)); append(form, 'headline_ar', first(ar.titleHighlight, ar.title, en.title)); append(form, 'headline_en', first(en.titleHighlight, en.title, ar.title));
  append(form, 'department', first(en.badge, ar.badge, 'Digital Solutions')); append(form, 'slug', slug); append(form, 'badge', first(en.badge, ar.badge)); append(form, 'description', first(en.description, ar.description)); append(form, 'is_active', 1);
  appendArray(form, 'technologies', first(en.tags, ar.tags, []));
  const problem = en.problemSection || ar.problemSection || {}; const solve = en.solveSection || ar.solveSection || {}; const deliver = en.deliverSection || ar.deliverSection || {}; const process = en.processSection || ar.processSection || {}; const why = en.whySection || ar.whySection || {};
  append(form, 'problem_badge', problem.badge); append(form, 'problem_department_title', problem.title); append(form, 'problem_department_subtitle', problem.subtitle);
  (problem.items || []).forEach((x, i) => { append(form, `challenges[${i}][title]`, x.title); append(form, `challenges[${i}][description]`, x.description); });
  append(form, 'solve_department_badge', solve.badge); append(form, 'solve_department_title', solve.title); append(form, 'solve_department_subtitle', solve.heading || solve.subtitle); append(form, 'solve_department_description', solve.description); append(form, 'solve_cta_text', solve.ctaButton);
  await appendFile(form, 'hero_image_file', first(en.heroImage, ar.heroImage), 'solution-hero.jpg'); await appendFile(form, 'solve_image_file', first(solve.image, ar.solveSection?.image), 'solution-solve.jpg');
  append(form, 'deliver_department_title', deliver.title); append(form, 'deliver_department_subtitle', deliver.subtitle); (deliver.items || []).forEach((x, i) => { append(form, `exits[${i}][title]`, x.title); append(form, `exits[${i}][description]`, x.description); });
  (process.steps || []).forEach((x, i) => { append(form, `proven_execution_framework[${i}][title]`, x.title); append(form, `proven_execution_framework[${i}][description]`, x.description); });
  (why.items || []).forEach((x, i) => { append(form, `why_choose_us[${i}][title]`, x.title); append(form, `why_choose_us[${i}][description]`, x.description); });
  return form;
}

async function brandPayload(item) {
  const en = localized(item, 'en'); const ar = localized(item, 'ar'); const form = new FormData();
  append(form, 'brand_ar', first(ar.title, en.title, item.slug)); append(form, 'brand_en', first(en.title, ar.title, item.slug)); append(form, 'subtitle_ar', first(ar.subtitle, en.subtitle)); append(form, 'subtitle_en', first(en.subtitle, ar.subtitle)); append(form, 'slug', item.slug); append(form, 'badge', first(en.badge, ar.badge)); append(form, 'layout', item.layout === 'image-right' ? 'image_right' : 'image_left'); append(form, 'brand_color', item.brandColor); append(form, 'accent_color', item.accentColor); append(form, 'description_ar', first(ar.description, en.description)); append(form, 'description_en', first(en.description, ar.description)); appendArray(form, 'categories', first(en.tags, ar.tags, [])); append(form, 'website_url', (en.links || ar.links || []).find((x) => x.type === 'primary')?.href); append(form, 'status_of_project', 'Live Production'); append(form, 'is_active', 1); append(form, 'is_coming_soon', 0); await appendFile(form, 'mockup_image_file', item.image, 'brand-mockup.png'); return form;
}

async function jobPayload(item) {
  const en = localized(item, 'en'); const ar = localized(item, 'ar'); const detail = jobDetailsData?.[item.slug] || {}; const dEn = localized(detail, 'en'); const dAr = localized(detail, 'ar'); const form = new FormData();
  append(form, 'job_title_ar', first(ar.title, en.title, item.slug)); append(form, 'job_title_en', first(en.title, ar.title, item.slug)); append(form, 'departement', first(en.department, ar.department, 'Engineering')); append(form, 'slug', item.slug); append(form, 'badge', first(en.badge, ar.badge)); append(form, 'job_type', first(en.type, ar.type)); append(form, 'job_location', first(en.location, ar.location)); append(form, 'experience', first(en.experience, ar.experience)); append(form, 'subtitle', first(en.subtitle, ar.subtitle)); append(form, 'description', first(dEn.description, dAr.description, en.subtitle, ar.subtitle)); appendArray(form, 'skills', first(dEn.skills, dAr.skills, [])); append(form, 'is_active', 1); await appendFile(form, 'job_image_file', first(dEn.image, dAr.image), 'job-image.jpg'); return form;
}

async function upsert(resource, endpoint, items, getSlug, makeForm) {
  const existing = await getExisting(endpoint);
  const bySlug = new Map(existing.map((row) => [row.slug, row]));
  report.totals[resource] = items.length; report.results.push(...[]);
  for (const item of items) {
    const slug = getSlug(item); const old = bySlug.get(slug); const result = { resource, slug, action: old ? 'update' : 'create', status: 'pending' };
    try {
      const form = await makeForm(item);
      if (DRY_RUN) { result.status = 'dry-run'; report.results.push(result); continue; }
      const body = await request(old ? `${endpoint}/${old.id}` : endpoint, { method: old ? 'PUT' : 'POST', body: form });
      result.status = 'success'; result.id = body?.data?.id || body?.id || old?.id; result.response = body?.message || 'ok';
    } catch (error) {
      const duplicate = error.body?.message && String(error.body.message).toLowerCase().includes('slug has already been taken');
      if (duplicate && !old && !DRY_RUN) {
        const match = (await getExisting(endpoint)).find((row) => row.slug === slug);
        if (match?.id) {
          try {
            const form = await makeForm(item);
            const body = await request(`${endpoint}/${match.id}`, { method: 'PUT', body: form });
            result.action = 'update-after-duplicate'; result.status = 'success'; result.id = body?.data?.id || body?.id || match.id; result.response = body?.message || 'ok';
          } catch (retryError) { result.status = 'failed'; result.httpStatus = retryError.status; result.error = retryError.message; result.body = retryError.body; }
        } else { result.status = 'failed'; result.httpStatus = error.status; result.error = error.message; result.body = error.body; }
      } else { result.status = 'failed'; result.httpStatus = error.status; result.error = error.message; result.body = error.body; }
    }
    report.results.push(result);
  }
}

async function main() {
  report.totals = { projects: projectsList.length, products: productsList.length, solutions: Object.keys(solutionDetailsData).length, brands: brandsPageData.en.featuredBrands.length, jobs: activeJobsList.length, localImages: 0 };
  if (!DRY_RUN) await login();
  await upsert('projects', '/dashboard/projects', projectsList, (x) => x.slug, projectPayload);
  await upsert('products', '/dashboard/products', productsList, (x) => x.slug, productPayload);
  await upsert('solutions', '/dashboard/solutions', Object.entries(solutionDetailsData), ([slug]) => slug, ([slug, value]) => solutionPayload(slug, value));
  await upsert('brands', '/dashboard/brand-showcases', brandsPageData.en.featuredBrands, (x) => x.slug, brandPayload);
  await upsert('jobs', '/dashboard/job-site', activeJobsList, (x) => x.slug, jobPayload);
  report.finishedAt = new Date().toISOString();
  report.summary = { success: report.results.filter((x) => x.status === 'success').length, failed: report.results.filter((x) => x.status === 'failed').length, dryRun: report.results.filter((x) => x.status === 'dry-run').length };
  await fs.writeFile(REPORT_JSON, JSON.stringify(report, null, 2));
  const lines = [`# Content Import Report`, ``, `- Started: ${report.startedAt}`, `- Finished: ${report.finishedAt}`, `- Mode: ${DRY_RUN ? 'dry-run' : 'live upload'}`, `- Success: ${report.summary.success}`, `- Failed: ${report.summary.failed}`, `- Dry-run items: ${report.summary.dryRun}`, ``, `## Totals`, ``];
  for (const [key, value] of Object.entries(report.totals)) lines.push(`- ${key}: ${value}`);
  lines.push('', '## Results', '', '| Resource | Slug | Action | Status | ID | Error |', '|---|---|---|---|---:|---|');
  for (const row of report.results) lines.push(`| ${row.resource} | ${row.slug} | ${row.action} | ${row.status} | ${row.id || ''} | ${(row.error || '').replaceAll('|', '\\|')} |`);
  if (report.warnings.length) lines.push('', '## Warnings', '', ...report.warnings.map((warning) => `- ${warning.message || JSON.stringify(warning)}`));
  await fs.writeFile(REPORT_MD, lines.join('\n') + '\n');
  console.log(JSON.stringify(report.summary));
  if (report.summary.failed) process.exitCode = 1;
}

await main();
