import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [userStats, setUserStats] = useState({
    completedTests: [],
    totalTestsTaken: 0,
    totalCorrectAnswers: 0,
  });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('userStats')) || {
      completedTests: [],
      totalTestsTaken: 0,
      totalCorrectAnswers: 0,
    };
    setUserStats(stats);
  }, []);

  const formatDate = (dateString) => {
    // Преобразуем строку в формат YYYY-MM-DD
    const parts = dateString.split('.');
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    
    const date = new Date(isoDate); // Конвертируем в объект Date
    const now = new Date();
    const diffInMs = now - date;
  
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInSeconds < 60) {
      // Если разница меньше минуты, выводим "только что"
      return 'Только что';
    }
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };  

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-photo">
          <img src="https://via.placeholder.com/150" alt="User Profile" />
        </div>
        <div className="profile-stats">
          <h2>Имя пользователя</h2>
          <p>Пройдено тестов: {userStats.totalTestsTaken}</p>
          <p>Правильных ответов: {userStats.totalCorrectAnswers}</p>
        </div>
      </div>

      <div className="last-tests">
        <h3>Последние тесты</h3>
        <ul>
          {userStats.completedTests.length === 0 ? (
            <p>Нет данных о тестах.</p>
          ) : (
            userStats.completedTests.map((test, index) => (
              <li key={index}>
                <div className="test-details">
                  <span className="test-name">{test.title}</span>
                  <span className="test-result">
                    {test.correctAnswers}/{test.totalQuestions} ({((test.correctAnswers / test.totalQuestions) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="test-time">{formatDate(test.date)}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
