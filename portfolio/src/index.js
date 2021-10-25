import {projects} from './assets/projects.js';
import {carousel} from './carousel.js';

// CONSTANTS
let delayBetweenProjectTitles = 300;

// VARIABLES
var selectedIndex = null;

const mainContainer = document.getElementsByClassName("container")[0];

export const loadProjects = () => {
    if (projects.length > 0) {
        setTimeout(() => {
            addProject(0);
        }, delayBetweenProjectTitles);
    }
}

const addProject = (i) => {
    let project = projects[i];
    let projectDiv = document.createElement('div');
    projectDiv.className = "project_container";
    let name = document.createElement("span");
    name.innerText = project["title"];
    name.className = "project_title";
    name.addEventListener('click', () => {handleSelectProject(i)})
    projectDiv.appendChild(name);
    mainContainer.appendChild(projectDiv);
    setTimeout(() => {
        projectDiv.style.opacity = 1;
    }, 50)
    if (i+1 < projects.length) {
        setTimeout(() => {
            addProject(i+1);
        }, delayBetweenProjectTitles);
    }
}

const handleSelectProject = (index) => {
    if (index != selectedIndex) {
        if (selectedIndex != null) closeProject(selectedIndex);
        openProject(index);
    }
    else closeProject(index);
}

const openProject = (index) => {
    let project = projects[index];
    if (project) {
        var container = mainContainer.children[index];
        container.classList.add("active");
        carousel(project, container, index);
    }
    selectedIndex = index;
}

const closeProject = (index) => {
    let projectContainer = mainContainer.children[index];
    
    projectContainer.getElementsByClassName("carousel_container")[0].classList.remove("visible");
    projectContainer.classList.remove("active");
    setTimeout(() => {
        projectContainer.getElementsByClassName("carousel_container")[0].remove();
    }, 500);
    projectContainer.getElementsByClassName("project_fullscreen_image")[0]?.remove();
    selectedIndex = null;
}