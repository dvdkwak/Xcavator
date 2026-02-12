console.log("🚀 Structured Twitter Miner Loaded");

// ==========================
// Global State
// ==========================
window.previousMinedPosts ??= [];   // Rolling last 20 tweets
window.seenPostIds ??= new Set();   // Deduplicate by tweet ID
window.miningActive ??= true;       // Mining status
window.scrollActive ??= false;      // Scrolling status

// ==========================
// Utilities
// ==========================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================
// Extract Tweet Data
// ==========================
function extractPostData(postNode) {
  const content = postNode.querySelector('[data-testid="tweetText"]');
  const timeEl = postNode.querySelector('time');

  if (!content || !timeEl) return null;

  const text = content.innerText.trim();
  const date = timeEl.getAttribute("datetime");

  const linkAnchor = timeEl.closest('a');
  const relativeLink = linkAnchor?.getAttribute('href');
  const link = relativeLink ? `https://twitter.com${relativeLink}` : null;

  if (!text || !date || !link) return null;

  const match = relativeLink.match(/status\/(\d+)/);
  if (!match) return null;

  const id = match[1];

  return { id, date, text, link };
}

// ==========================
// Send Overflow to Local API
// ==========================
async function sendTweetToLocalAPI(tweetObj) {
  try {
    await fetch("http://localhost:3000/save-tweet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tweetObj)
    });

    console.log("📤 Sent to API:", tweetObj.id);
  } catch (err) {
    console.error("❌ Failed to send tweet:", err);
  }
}

// ==========================
// Process Post (after expansion)
// ==========================
function processPost(postNode) {
  if (!window.miningActive) return;

  const data = extractPostData(postNode);
  if (!data) return;

  if (window.seenPostIds.has(data.id)) return;
  window.seenPostIds.add(data.id);

  window.previousMinedPosts.push(data);
  console.log("🧩 Mined:", data);

  // Handle overflow
  if (window.previousMinedPosts.length > 20) {
    const overflow = window.previousMinedPosts.shift();
    sendTweetToLocalAPI(overflow);
  }
}

// ==========================
// Handle Post (expand safely)
// ==========================
function handlePost(postNode) {
  if (!window.miningActive) return;

  // Get the main tweet text container.
  const mainContent = postNode.querySelector('[data-testid="tweetText"]');
  if (!mainContent) {
    processPost(postNode);
    return;
  }

  // Look for a Read more button.
  // Ignore any nested tweets || quotes completely.
  const readMoreBtn = Array.from(mainContent.parentElement.querySelectorAll('span'))
    .find(span => {
      const text = span.innerText.toLowerCase();
      if (text !== 'read more' && text !== 'meer weergeven') return false;
      if (!span.offsetParent) return false;
      return mainContent.parentElement.contains(span);
    });
  if (readMoreBtn) {
    try {
      readMoreBtn.click(); // expand main tweet
      requestAnimationFrame(() => processPost(postNode));
    } catch {
      processPost(postNode);
    }
  } else {
    // No Read more for main tweet --> process immediately
    processPost(postNode);
  }
}

// ==========================
// Initial Mine
// ==========================
function initialMine() {
  const timeline = document.querySelector('section');
  if (!timeline) {
    setTimeout(initialMine, 1000);
    return;
  }

  const posts = timeline.querySelectorAll('article');
  posts.forEach(handlePost);

  console.log(`✅ Initial mine complete (${posts.length} posts scanned)`);
}

// ==========================
// MutationObserver
// ==========================
const observer = new MutationObserver(mutations => {
  if (!window.miningActive) return;

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;

      if (node.matches?.('article')) {
        handlePost(node);
      }

      const nested = node.querySelectorAll?.('article');
      nested?.forEach(handlePost);
    }
  }
});

function startObserving() {
  const timeline = document.querySelector('section');
  if (!timeline) {
    setTimeout(startObserving, 1000);
    return;
  }

  observer.observe(timeline, {
    childList: true,
    subtree: true
  });

  console.log("👀 Live mining started");
}

// ==========================
// Scroll Controller (500px/sec)
// ==========================
window.startScrolling = async function () {
  if (window.scrollActive) return;

  window.scrollActive = true;
  console.log("▶️ Auto-scroll started (500px/sec)");

  while (window.scrollActive) {
    const beforeHeight = document.body.scrollHeight;

    window.scroll({
      top: beforeHeight + 500,
      behavior: "smooth"
    });
    await sleep(1000);
  }
};

window.stopScrolling = function () {
  window.scrollActive = false;
  console.log("🛑 Auto-scroll stopped");
};

// ==========================
// Mining Controls
// ==========================
window.stopMining = function () {
  window.miningActive = false;
  observer.disconnect();
  console.log("🛑 Mining stopped");
};

window.startMining = function () {
  if (window.miningActive) return;

  window.miningActive = true;
  startObserving();
  console.log("▶️ Mining restarted");
};

// ==========================
// Debug Helper
// ==========================
window.dumpMiningState = function () {
  console.log("===== MINING STATE =====");
  console.log("Mining active:", window.miningActive);
  console.log("Scroll active:", window.scrollActive);
  console.log("Rolling buffer size:", window.previousMinedPosts.length);
  console.log("Total unique IDs:", window.seenPostIds.size);
  console.log("========================");
};

// ==========================
// Start Everything
// ==========================
initialMine();
startObserving();
