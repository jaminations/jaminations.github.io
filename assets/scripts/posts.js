import { marked } from '../../packages/marked.min.js';

import Posts from './post-metadata.js';
import FetchText from './lib/fetch-text.js';

const list = document.getElementById('posts');
const markdown = document.getElementById('markdown');
const template = document.getElementById('post-template');

const TITLE = "Jam's Portfolio";

// Stores all parsed posts
const PostCache = {};

// String to slug
const ToSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w \-]+/g, '')
    .replace(/ +/g, '-');
};

// Fetches or loads the post from cache
const LoadPost = async (post) => {
  let content = PostCache[post.body];

  window.history.pushState({}, '', `#${ToSlug(post.title)}`);
  document.title = `${TITLE} - ${post.title}`;

  if (!content) {
    const raw = await FetchText(`posts/content/${post.body}.md`);
    content = marked.parse(raw);

    // Add to the cache
    PostCache[post.body] = content;
  }

  markdown.innerHTML = content;

  markdown.classList.add('viewing');
  list.classList.add('viewing');
};

// Load current post from the url
const OnUpdate = () => {
  const index = window.location.hash.substring(1);
  const post = Posts.find((p) => ToSlug(p.title) == index);

  if (post) {
    LoadPost(post);
  } else {
    markdown.classList.remove('viewing');
    list.classList.remove('viewing');

    document.title = TITLE;
  }
};

// Update on page load
OnUpdate();

// Update on URL change
window.addEventListener('hashchange', OnUpdate);

// Add every post to the list
for (const [id, post] of Posts.entries()) {
  const entry = template.cloneNode(true);
  entry.removeAttribute('id');

  const title = entry.querySelector('.title');
  const description = entry.querySelector('.description');
  const image = entry.querySelector('.image');
  const gradient = entry.querySelector('.gradient');
  const timestamp = entry.querySelector('.timestamp');

  // Update contents
  title.innerHTML = post.title;
  description.innerHTML = post.description;

  // Update the banner
  if (post.thumbnail) {
    image.setAttribute('src', post.thumbnail); // Set the source to the image path
  } else {
    gradient.remove(); // Exclude the gradient
    image.remove(); // Exclude the thumbnail
  }

  // Format the date and update the content
  timestamp.innerHTML = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Load the post on click
  entry.addEventListener('click', () => LoadPost(post));

  // Add entry to the post
  list.appendChild(entry);
}
