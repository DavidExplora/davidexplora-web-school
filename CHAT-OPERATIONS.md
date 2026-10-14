# Live chat and visitor alerts

David’s tawk.to property: `6acfc0086fd69f34cebb33c5`.
Widget: `1k4toc8sl`.
These public embed identifiers are not account passwords or API secrets.

## What is installed

`live-chat.js` loads David’s supplied asynchronous widget on `https://davidexplora.com`, `https://www.davidexplora.com` and the existing public Sites address. The generated pages include the loader once; the legacy redirect does not need it. Local VS Code/file previews do not create visitor sessions in this account.

The existing welcome and floating WhatsApp controls stay available until the provider reports that its widget has rendered. If a visitor is using those controls with a keyboard, the handoff waits for focus to move away. A failed or blocked widget leaves the fallback contact controls available. Header/footer WhatsApp and email links remain available throughout.

The integration does not identify visitors or copy planner/support form fields into chat. Anonymous sessions can still include technical activity processed by the provider. `privacy.html` describes that service. Chat is separate from confirmed bookings, seat availability and payments.

## Finish setup in David’s account

1. Click **Next** on the “Your widget is ready!” screen and select the David Explora property in the dashboard.
2. Set availability and working hours to reflect when David can answer. Check the offline message/form so visitors can leave an enquiry outside those hours.
3. Open the profile menu at the bottom left → **Manage Sounds & Notifications**. Enable **New Visitor**, **New Chat** and **New Message** sounds, and desktop notifications. Save the settings.
4. Allow notifications for `https://dashboard.tawk.to` in the browser and allow that browser or the tawk.to app in Windows notification settings. Keep the dashboard/app running and check that Do Not Disturb is not suppressing alerts.
5. The official Windows application is available at https://www.tawk.to/windows/. Sign in to David’s own account; no card is needed for the base live-chat service.

New-visitor alerts concern widget sessions. Blockers, connectivity and visitor consent can affect monitoring; they are not a guaranteed count of every person or a substitute for Search Console or a marketing analytics service.

## Appearance and privacy settings

In **Administration → Chat Widget**, set the widget name to David Explora, use the site’s forest green (`#173d32`) and check the desktop/mobile placement. The integration keeps the widget below the site navigation. Check the open chat on a small phone screen for overlap before adding extra widgets.

Suggested greeting:

> Karibu to David Explora. Planning Kilimanjaro, a safari or Zanzibar? Share your dates and group size, and I’ll help you choose an itinerary.

Set an honest expected response time and an offline greeting. Do not promise immediate replies unless David is available.

Open **Configure consent** in the widget settings. Review and enable the relevant European and U.S. consent forms for the travellers served, using `https://davidexplora.com/privacy.html` as the site privacy link. Consent settings are controlled by the account owner and have not been verified by the code integration. The provider can set session cookies/storage when consent forms are disabled; do not claim consent or legal compliance based only on installing the widget.

## Owner’s test after publication

1. Keep David’s dashboard or app open, with the property online.
2. Open `https://davidexplora.com` in a private/incognito window or a second device. Accept the configured chat consent if prompted. Check **Monitoring** for the test session and listen for the enabled visitor sound.
3. Open the chat and send “David Explora live-chat test”. Check that it reaches the dashboard, then reply and confirm the visitor window receives the reply.
4. Open a tour page and the Spanish support page. Check the chat placement, readable text and that only one floating chat launcher is shown. Use Tab to check the site navigation and chat controls.
5. Test a phone as well. If alerts fail, check dashboard sound settings, browser/Windows permissions, app status and Do Not Disturb. If the widget fails to load, use the visible WhatsApp/email contacts while investigating.

Live chat and alert delivery cannot be verified from the managed code environment. David’s actual dashboard, notification permissions and the external service must be included in this test.

## Official references

- Install the widget: https://help.tawk.to/article/adding-a-widget-to-your-website
- Notifications: https://help.tawk.to/article/managing-sound-settings-and-desktop-notifications
- Notification troubleshooting: https://help.tawk.to/article/why-am-i-not-getting-notifications
- Visitor monitoring: https://help.tawk.to/article/understanding-visitor-monitoring-and-chat-sessions
- JavaScript API: https://developer.tawk.to/jsapi/
- Privacy policy: https://www.tawk.to/privacy-policy/
- Cookies: https://help.tawk.to/article/what-are-tawkto-cookies-and-what-do-they-do
