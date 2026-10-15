'use strict';

document.body.classList.add('js-ready');
const api = window.DavidJourney;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function closeMenu() {
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Open navigation');
}
menu?.addEventListener('click', () => {
  const open = !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) { closeMenu(); menu.focus(); }
});
document.addEventListener('click', event => {
  if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());

const form = document.querySelector('#trip-inquiry-form');
const status = document.querySelector('#inquiry-status');
const selections = { destination: '', interest: '', duration: '' };
let currentPlan = null;
const result = document.querySelector('#journey-result');
const plannerStatus = document.querySelector('#planner-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function reveal(element) { element?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' }); }
function setField(id, value) { const field = document.getElementById(id); if (field) field.value = value; }
function resetRequest() {
  const ready = document.querySelector('#inquiry-ready');
  if (ready) ready.hidden = true;
  if (status) status.textContent = '';
  const link = document.querySelector('#inquiry-whatsapp');
  if (link) link.href = 'https://wa.me/' + api.phone;
  const emailLink = document.querySelector('#inquiry-email');
  if (emailLink) emailLink.href = 'mailto:info@davidexplora.com';
  const preview = document.querySelector('#inquiry-preview');
  if (preview) preview.textContent = '';
  const emailMessage = document.querySelector('#inquiry-message');
  if (emailMessage) emailMessage.value = '';
  const copyStatus = document.querySelector('#copy-status');
  if (copyStatus) copyStatus.textContent = '';
}

document.querySelectorAll('.planner-options button').forEach(button => {
  button.addEventListener('click', () => {
    const key = ['destination', 'interest', 'duration'].find(name => button.dataset[name]);
    if (!key) return;
    selections[key] = button.dataset[key];
    document.querySelectorAll('.planner-options [data-' + key + ']').forEach(option => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    if (result) result.hidden = true;
    currentPlan = null;
    if (plannerStatus) plannerStatus.textContent = '';
  });
});
document.querySelector('#build-journey')?.addEventListener('click', () => {
  currentPlan = api.buildPlan(selections);
  if (!currentPlan) {
    plannerStatus.textContent = 'Choose a destination, an interest and your available time to see a starting idea.';
    return;
  }
  plannerStatus.textContent = '';
  document.querySelector('#journey-title').textContent = currentPlan.title;
  document.querySelector('#journey-message').textContent = currentPlan.duration + ' · ' + currentPlan.summary;
  document.querySelector('#journey-note').textContent = currentPlan.note;
  const steps = document.querySelector('#journey-steps');
  steps.replaceChildren(...currentPlan.steps.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
  const detail = document.querySelector('#journey-detail');
  detail.href = currentPlan.link;
  result.hidden = false;
  reveal(result);
});
document.querySelector('#plan-this-trip')?.addEventListener('click', () => {
  if (!currentPlan || !form) return;
  setField('trip-package', '');
  setField('trip-destination', currentPlan.destination);
  setField('trip-duration', currentPlan.duration);
  setField('trip-message', currentPlan.message);
  resetRequest();
  reveal(document.querySelector('#contact'));
});

if (form) {
  const whatsappOption = document.querySelector('#prepare-whatsapp');
  if (whatsappOption) whatsappOption.hidden = false;
  const destinationPreset = api.urlPreset(window.location.search);
  if (destinationPreset) {
    const [destination, duration, message] = destinationPreset;
    setField('trip-destination', destination);
    setField('trip-duration', duration);
    setField('trip-message', message);
  }
  const now = new Date();
  const today = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  const dateInput = document.querySelector('#travel-date');
  dateInput.min = today;
  form.addEventListener('input', resetRequest);
  form.addEventListener('change', resetRequest);
  form.addEventListener('submit', event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    const field = id => document.getElementById(id).value;
    const chosenPackage = window.DavidTours?.getTour(field('trip-package'));
    const inquiry = api.createInquiry({ name: field('customer-name'), email: field('customer-email'), whatsapp: field('customer-whatsapp'), date: field('travel-date'), travelers: field('traveler-count'), arrival: field('trip-arrival'), flexibility: field('trip-date-flexibility'), package: chosenPackage?.title || '', budget: field('trip-budget'), destination: field('trip-destination'), duration: field('trip-duration'), style: field('trip-style'), language: field('trip-language'), message: field('trip-message'), consent: document.querySelector('#privacy-consent').checked }, today);
    if (inquiry.errors.length) {
      event.preventDefault();
      status.textContent = inquiry.errors.join(' ');
      status.tabIndex = -1;
      status.focus();
      return;
    }
    document.querySelector('#inquiry-preview').textContent = inquiry.text;
    document.querySelector('#inquiry-whatsapp').href = inquiry.url;
    document.querySelector('#inquiry-email').href = inquiry.emailURL;
    document.querySelector('#inquiry-message').value = inquiry.text;
    if (event.submitter?.id !== 'prepare-whatsapp') {
      status.textContent = 'Continue to the anti-spam check to submit your enquiry to David by email.';
      return;
    }
    event.preventDefault();
    const ready = document.querySelector('#inquiry-ready');
    ready.hidden = false;
    status.textContent = 'Your request is prepared. Choose WhatsApp or email below and press Send in that app. Nothing has been sent yet.';
    reveal(ready);
    document.querySelector('#inquiry-whatsapp').focus({ preventScroll: true });
  });
  document.querySelector('#copy-inquiry')?.addEventListener('click', async () => {
    const copyStatus = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#inquiry-preview').textContent);
      copyStatus.textContent = 'Message copied. Paste it into your conversation with David.';
    } catch {
      document.querySelector('#inquiry-ready details').open = true;
      copyStatus.textContent = 'Open the message preview, select the text and copy it manually.';
    }
  });
}
