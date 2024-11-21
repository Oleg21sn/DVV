const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Вказуємо порт без .env

// Налаштування для обробки форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Сервіруємо статичні файли (наприклад, index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Роут для отримання всіх постів
let posts = []; // Замість бази даних, використовуємо масив для зберігання постів

app.get('/posts', (req, res) => {
  res.json(posts);
});

// Роут для створення нового поста
app.post('/posts', (req, res) => {
  try {
    const { title, description, author } = req.body;
    
    const newPost = { title, description, author, id: posts.length + 1 };
    posts.push(newPost); // Додаємо новий пост до масиву
    
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Роут для редагування поста
app.put('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, author } = req.body;

    const postIndex = posts.findIndex((post) => post.id === parseInt(id));
    if (postIndex !== -1) {
      posts[postIndex] = { id: parseInt(id), title, description, author };
      res.json(posts[postIndex]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Роут для видалення поста
app.delete('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;

    const postIndex = posts.findIndex((post) => post.id === parseInt(id));
    if (postIndex !== -1) {
      posts.splice(postIndex, 1); // Видаляємо пост
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Стартуємо сервер
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
