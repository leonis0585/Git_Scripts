// ==UserScript==
// @name         GitHub Follow/Unfollow All Users on Page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT License
// @description  Allows you to follow or unfollow all users listed on a GitHub user page with a single click (with live counter). 🐒⚡️
// @author       isyuricunha
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// ==/UserScript==

(function () {
  "use strict";

  // Generic function for mass follow/unfollow
  function massAction(buttonText, valueSelector, actionName) {
    const actionButtons = document.querySelectorAll(`input[value="${valueSelector}"]`);
    if (actionButtons.length === 0) {
      alert(`No "${valueSelector}" buttons found on the page.`);
      return;
    }

    let count = 0;
    const actionBtn = document.getElementById(`mass-${actionName}`);
    actionBtn.disabled = true;
    actionBtn.innerText = `${buttonText} (0/${actionButtons.length})`;

    const interval = setInterval(() => {
      const btn = document.querySelector(`input[value="${valueSelector}"]`);
      if (btn) {
        btn.click();
        btn.remove();
        count++;
        actionBtn.innerText = `${buttonText} (${count}/${actionButtons.length})`;
      } else {
        clearInterval(interval);
        console.log(`${actionName} finished.`);
        actionBtn.innerText = `✔ ${buttonText} (${count})`;
        setTimeout(() => location.reload(), 1500);
      }
    }, 1500);
  }

  // Injects the action buttons into the profile UI
  function injectButtons() {
    const container = document.querySelector(".js-profile-editable-area .js-user-profile-bio");
    if (!container) return;

    container.insertAdjacentHTML(
      "afterEnd",
      `<div class="mb-3" id="mass-actions">
         <button type="button" class="btn btn-sm btn-block btn-primary mb-2" id="mass-follow">Follow All</button>
         <button type="button" class="btn btn-sm btn-block btn-danger" id="mass-unfollow">Unfollow All</button>
       </div>`
    );

    document.getElementById("mass-follow").onclick = () =>
      massAction("Following", "Follow", "follow");

    document.getElementById("mass-unfollow").onclick = () =>
      massAction("Unfollowing", "Unfollow", "unfollow");

    console.log("Follow/Unfollow buttons added.");
  }

  // Only runs if Follow or Unfollow buttons are present
  const hasFollowOrUnfollow = document.querySelector('input[value="Follow"], input[value="Unfollow"]');
  if (hasFollowOrUnfollow) injectButtons();
})();
