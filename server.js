const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');

const loadPosts = async () => {
  try {
    const res = await fetch('/posts');
    const posts = await res.json();
    postList.innerHTML = posts
      .map(
        (post) => `
        <li class="post-item" id="post-${post._id}">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <p><strong>Author:</strong> ${post.author}</p>
          <button onclick="deletePost('${post._id}')">Delete</button>
          <button onclick="editPost('${post._id}', '${post.title}', '${post.description}', '${post.author}')">Edit</button>
        </li>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error loading posts:', error);
    postList.innerHTML = `<li>Error loading posts</li>`;
  }
};

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const description = document.getElementById('description').value;

  try {
    const method = postForm.dataset.editing ? 'PUT' : 'POST';
    const url = postForm.dataset.editing
      ? `/posts/${postForm.dataset.editing}`
      : '/posts';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, description }),
    });

    if (!res.ok) {
      throw new Error('Failed to save post');
    }

    postForm.reset();
    delete postForm.dataset.editing; // Скидаємо режим редагування
    loadPosts();
  } catch (error) {
    console.error('Error saving post:', error);
  }
});

const deletePost = async (id) => {
  try {
    const res = await fetch(`/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete post');
    }
    loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const editPost = (id, title, description, author) => {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('author').value = author;
  postForm.dataset.editing = id; // Зберігаємо ID поста в атрибуті форми
};

loadPosts();
