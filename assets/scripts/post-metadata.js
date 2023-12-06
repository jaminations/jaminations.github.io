import yaml from '../../packages/js-yaml.min.js';
import FetchText from './lib/fetch-text.js';

// Fetch all file names and only include metadata files
const all = await FetchText('posts/media/generated/all-posts');
const files = all.split(/\n|\r/).filter((file) => file.endsWith('.yml'));

const unlisted = /unlisted\..+\.yml/;

// Fetch all post metadata
let Posts = [];

for (const name of files) {
  if (unlisted.test(name)) {
    continue;
  }

  const metadata = await FetchText(`posts/${name}`);
  Posts.push(yaml.load(metadata));
}

// Sort the posts by their creation date
Posts = Posts.sort((a, b) => b.date.getTime() - a.date.getTime());

// Sort the posts by their pinned state
Posts = Posts.sort((a, b) => Number(b.pinned || false) - Number(a.pinned || false));

// Make the posts accessible to other modules
export default Posts;
