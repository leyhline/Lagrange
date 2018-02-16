"use strict";

/**
 * Folds code blocks to toggle between showing and hiding them.
 * @param {int} index - Chose which block to fold if there are multiple. 
 */
function toggleCode(index) {
    var element = document.getElementsByClassName("highlight")[index];
    if (element.style.display !== "block") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}