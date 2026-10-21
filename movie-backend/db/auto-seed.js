// db/auto-seed.js
// Автоматически наполняет БД, если она пустая
const db = require('./init');
const bcrypt = require('bcryptjs');

function autoSeed() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    
    if (userCount === 0) {
      console.log('🌱 База пуста. Добавляю демо-данные...');
      
      // Добавляем пользователей
      const hash = bcrypt.hashSync('123456', 10);
      const insertUser = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
      insertUser.run('Админ', 'admin@sweet.ru', hash);
      insertUser.run('Маша', 'masha@test.ru', hash);

      // Добавляем товары (пример, если у тебя есть таблица products или orders)
      // ... (здесь код добавления заказов/картинок, если нужно)
      
      console.log('✅ Демо-данные добавлены!');
    }
  } catch (err) {
    console.error('Ошибка автонаполнения:', err.message);
  }
}

module.exports = autoSeed;