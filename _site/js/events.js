const syncEventShareState = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (target && target.tagName === 'DETAILS') {
        target.open = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const syncEventHash = (details) => {
    if (!details || !details.id) return;

    const targetHash = `#${details.id}`;
    const currentHash = window.location.hash;

    if (details.open && currentHash !== targetHash) {
        history.replaceState(null, '', `${window.location.pathname}${targetHash}`);
        return;
    }

    if (!details.open && currentHash === targetHash) {
        history.replaceState(null, '', window.location.pathname);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    syncEventShareState();

    document.querySelectorAll('.event-row').forEach((details) => {
        details.addEventListener('toggle', () => syncEventHash(details));
    });

    const shareSheet = document.getElementById('share-sheet');
    const closeShareSheet = () => {
        if (!shareSheet) return;
        shareSheet.classList.remove('is-open');
        shareSheet.setAttribute('aria-hidden', 'true');
    };

    const openShareSheet = (shareUrl, eventTitle) => {
        if (!shareSheet) return false;

        shareSheet.dataset.shareUrl = shareUrl;
        shareSheet.dataset.eventTitle = eventTitle;
        shareSheet.classList.add('is-open');
        shareSheet.setAttribute('aria-hidden', 'false');
        return true;
    };

    const performShareAction = async (platform, shareUrl, eventTitle) => {
        const text = `${eventTitle} — SGA Romania Student Chapter`;

        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(shareUrl);
                return 'Copied';
            } catch (error) {
                window.location.href = shareUrl;
                return 'Opened';
            }
        }

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, '_blank', 'noopener,noreferrer');
            return 'WhatsApp';
        }

        return null;
    };

    document.querySelectorAll('.share-option').forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const platform = button.dataset.sharePlatform;
            const shareUrl = shareSheet?.dataset.shareUrl || '';
            const eventTitle = shareSheet?.dataset.eventTitle || 'Event';

            const label = await performShareAction(platform, shareUrl, eventTitle);
            if (label) {
                closeShareSheet();
            }
        });
    });

    document.querySelector('.share-close')?.addEventListener('click', closeShareSheet);
    shareSheet?.querySelector('[data-close-share]')?.addEventListener('click', closeShareSheet);

    document.querySelectorAll('.event-share').forEach((link) => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();

            const details = link.closest('.event-row');
            const shareUrl = new URL(`${window.location.pathname}#${details.id}`, window.location.href).toString();
            const eventTitle = details.dataset.title || details.querySelector('.event-name')?.textContent || 'Event';

            try {
                if (navigator.share && navigator.canShare) {
                    const shareData = {
                        title: 'SGA Romania Student Chapter',
                        text: eventTitle,
                        url: shareUrl
                    };

                    if (navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                        return;
                    }
                }
            } catch (error) {
                // continue to the fallback share sheet
            }

            openShareSheet(shareUrl, eventTitle);
        });
    });
});
