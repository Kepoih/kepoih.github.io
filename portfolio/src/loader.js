import {loadProjects} from './index.js';

var container = null;
let delayBetweenProjectTitles = 300;
let delayBeforeLoading = 500;

window.onload = () => {
    const links = document.getElementsByClassName('menu-link');
    if (links.length > 1) {
        Array.prototype.forEach.call(links, link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                unload(() => {
                    window.location.replace(link.href);
                });
            })
        })
    }
    container = document.getElementsByClassName('container')[0];
    setTimeout(() => {
        if (container.id == "projects_page") loadProjects();
        else loadContent();
    }, delayBeforeLoading)
}

export const unload = (callback) => {
    const items = document.getElementsByClassName('container')[0].children;
    popItem(items, items.length-1, callback);
}

const popItem = (items, index, callback) => {
    if (index >= 0) {
        let item = items[index];
        item.style.opacity = 0;
        setTimeout(() => {
            popItem(items, index-1, callback);
        }, delayBetweenProjectTitles);
    } else {
        setTimeout(() => {
            callback();
        }, delayBeforeLoading)
    }
}

const loadContent = () => {
    const items = document.getElementsByClassName('container')[0].children;
    showItem(items, 0, () => {});
}

const showItem = (items, index, callback) => {
    if (items.length > index) {
        setTimeout(() => {
            items[index].style.opacity = 1;
            showItem(items, index+1, callback);
        }, delayBetweenProjectTitles);
    } else {
        callback();
    }
}