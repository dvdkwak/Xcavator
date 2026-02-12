window.startScrolling = async function () {
  console.log("✅ Auto-scroll started");
  if (window.scrollActive) return;
  window.scrollActive = true;
  while (window.scrollActive) {
    const beforeHeight = document.body.scrollHeight;
    window.scroll({
      top: beforeHeight+500,
      behavior: "smooth"
    });
    await new Promise(r => setTimeout(r, 1200));
    const afterHeight = document.body.scrollHeight;
    // Stop if no new content loads
    // if (afterHeight === beforeHeight) {
    //   console.log("Reached end of feed");
    //   window.scrollActive = false;
    // }
  }
}

window.startScrolling();
