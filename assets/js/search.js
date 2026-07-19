import * as params from '@params';

const resultsList = document.getElementById('searchResults');
const input = document.getElementById('searchInput');
const searchBox = document.getElementById('searchbox');
const status = document.getElementById('searchStatus');

let fuse;
let resultLinks = [];

const defaultFuseOptions = {
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
    keys: ['title', 'permalink', 'summary', 'content', 'topics', 'type']
};

const buildFuseOptions = () => {
    if (!params.fuseOpts) return defaultFuseOptions;

    return {
        isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
        includeScore: params.fuseOpts.includescore ?? false,
        includeMatches: params.fuseOpts.includematches ?? false,
        minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
        shouldSort: params.fuseOpts.shouldsort ?? true,
        findAllMatches: params.fuseOpts.findallmatches ?? false,
        keys: params.fuseOpts.keys ?? defaultFuseOptions.keys,
        location: params.fuseOpts.location ?? 0,
        threshold: params.fuseOpts.threshold ?? defaultFuseOptions.threshold,
        distance: params.fuseOpts.distance ?? defaultFuseOptions.distance,
        ignoreLocation: params.fuseOpts.ignorelocation ?? defaultFuseOptions.ignoreLocation
    };
};

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};

const setStatus = (message) => {
    if (status) status.textContent = message;
};

const setActiveResult = (element) => {
    document.querySelectorAll('.focus').forEach((item) => item.classList.remove('focus'));
    if (!element) return;

    element.focus();
    element.closest('li')?.classList.add('focus');
};

const reset = () => {
    resultsList.replaceChildren();
    resultLinks = [];
    input.value = '';
    input.focus();
    setStatus(searchBox?.dataset.labelReady || 'Search is ready');
};

const renderResults = (results) => {
    const fragment = document.createDocumentFragment();

    for (const result of results) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        const title = document.createElement('span');
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        link.className = 'nf-search-result__link';
        link.href = result.item.permalink;
        title.className = 'nf-search-result__title';
        title.textContent = result.item.title;

        icon.setAttribute('width', '24');
        icon.setAttribute('height', '24');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>';

        link.append(title, icon);
        item.appendChild(link);
        fragment.appendChild(item);
    }

    resultsList.replaceChildren(fragment);
    resultLinks = Array.from(resultsList.querySelectorAll('.nf-search-result__link'));

    if (results.length === 0 && input.value.trim()) {
        setStatus(searchBox?.dataset.labelEmpty || 'No results');
    } else if (results.length > 0) {
        if (results.length === 1) {
            setStatus(searchBox?.dataset.labelResult || '1 result');
        } else {
            const template = searchBox?.dataset.labelResults || '%d results';
            setStatus(template.replace('%d', String(results.length)));
        }
    }
};

const performSearch = () => {
    if (!fuse) return;

    const query = input.value.trim();
    if (!query) {
        renderResults([]);
        setStatus(searchBox?.dataset.labelReady || 'Search is ready');
        return;
    }

    const searchOptions = params.fuseOpts?.limit ? { limit: params.fuseOpts.limit } : undefined;
    renderResults(searchOptions ? fuse.search(query, searchOptions) : fuse.search(query));
};

const initSearch = async () => {
    if (!input || !resultsList || !searchBox) return;

    try {
        const response = await fetch(searchBox.dataset.indexUrl || '../index.json');
        if (!response.ok) throw new Error(`Search index load failed: ${response.status}`);

        const data = await response.json();
        fuse = new Fuse(Array.isArray(data) ? data : [], buildFuseOptions());
        input.disabled = false;
        setStatus(searchBox.dataset.labelReady || 'Search is ready');
    } catch (error) {
        console.error(error);
        input.disabled = true;
        setStatus(searchBox.dataset.labelError || 'Search is temporarily unavailable');
    }
};

initSearch();
input?.addEventListener('input', debounce(performSearch, 150));
input?.addEventListener('search', () => {
    if (!input.value) reset();
});

document.addEventListener('keydown', (event) => {
    const active = document.activeElement;
    if (!searchBox?.contains(active)) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        reset();
        return;
    }

    if (resultLinks.length === 0) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (active === input) {
            setActiveResult(resultLinks[0]);
        } else {
            const index = resultLinks.indexOf(active);
            setActiveResult(resultLinks[Math.min(index + 1, resultLinks.length - 1)]);
        }
    } else if (event.key === 'ArrowUp' && active !== input) {
        event.preventDefault();
        const index = resultLinks.indexOf(active);
        if (index <= 0) {
            input.focus();
        } else {
            setActiveResult(resultLinks[index - 1]);
        }
    }
});
