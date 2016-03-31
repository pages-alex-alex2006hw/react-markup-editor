
// Find ancestor of a DOM element with a specific class
function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

module.exports = findAncestor;
