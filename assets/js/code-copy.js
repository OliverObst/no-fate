import * as params from '@params';

document.querySelectorAll('pre > code').forEach((codeblock) => {
    const container = codeblock.parentNode.parentNode;
    const button = document.createElement('button');

    button.classList.add('copy-code');
    button.type = 'button';
    button.textContent = params.copy || 'Copy';
    button.setAttribute('aria-label', params.copy || 'Copy code');

    button.addEventListener('click', async () => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(codeblock.textContent);
        } else {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(codeblock);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
        }

        button.textContent = params.copied || 'Copied';
        window.setTimeout(() => {
            button.textContent = params.copy || 'Copy';
        }, 2000);
    });

    if (container.classList.contains('highlight')) {
        container.appendChild(button);
    } else {
        codeblock.parentNode.appendChild(button);
    }
});
