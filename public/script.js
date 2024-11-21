const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');

let editMode = false; 
let editPostId = null; 

const loadPosts = async () => {
  const res = await fetch('/posts');
  const posts = await res.json();
  postList.innerHTML = posts
    .map(
      (post) => `
    <li class="post-item">
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <p><strong>Author:</strong> ${post.author}</p>
      <button onclick="deletePost(${post.id})">Delete</button>
      <button onclick="editPost(${post.id}, '${post.title}', '${post.description}', '${post.author}')">Edit</button>
    </li>
  `
    )
    .join('');
};

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const description = document.getElementById('description').value;

  if (editMode) {
    await fetch(`/posts/${editPostId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, description }),
    });
    editMode = false; 
    editPostId = null;
    document.querySelector('button[type="submit"]').textContent = 'Create Post';
  } else {
    await fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, description }),
    });
  }

  postForm.reset();
  loadPosts();
});

const deletePost = async (id) => {
  await fetch(`/posts/${id}`, { method: 'DELETE' });
  loadPosts();
};

const editPost = (id, title, description, author) => {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('author').value = author;

  editMode = true;
  editPostId = id;
  document.querySelector('button[type="submit"]').textContent = 'OK'; 
};

loadPosts();
