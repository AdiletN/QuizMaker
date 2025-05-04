import React, { useState } from 'react';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const [quizzes] = useState(JSON.parse(localStorage.getItem('quizzes')) || []);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;

  const handleQuizSelect = (index) => {
    setSelectedQuizIndex(index);
    setAnswers(Array(quizzes[index].questions.length).fill(null));
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.tags && quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  if (selectedQuizIndex === null) {
    return (
      <div className="quiz-list">
        <input
          type="text"
          placeholder="Поиск по названию или тегу..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <h2>Выберите викторину</h2>
        <div className="quiz-list-container">
          {quizzes.length === 0 ? (
            <p>Нет доступных викторин.</p>
          ) : (
            currentQuizzes.map((quiz, i) => (
              <div
                key={indexOfFirstQuiz + i}
                className="quiz-card"
                onClick={() => handleQuizSelect(quizzes.indexOf(quiz))}
              >
                <div className="quiz-header">
                  <h3>{quiz.title}</h3>
                  <span>{quiz.questions.length} вопросов</span>
                </div>
                <p className="quiz-description">{quiz.description}</p>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const quiz = quizzes[selectedQuizIndex];
  const question = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = value;
    setAnswers(updated);
  };

  const handleFinish = () => {
    setIsFinished(true);
    const userStats = JSON.parse(localStorage.getItem('userStats')) || {
      completedTests: [],
      totalTestsTaken: 0,
      totalCorrectAnswers: 0,
    };
    const score = calculateScore();
    const completedTest = {
      title: quiz.title,
      correctAnswers: score,
      totalQuestions: quiz.questions.length,
      date: new Date().toLocaleDateString(),
    };
    userStats.completedTests.push(completedTest);
    userStats.totalTestsTaken += 1;
    userStats.totalCorrectAnswers += score;
    localStorage.setItem('userStats', JSON.stringify(userStats));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (q.type === 'text' && typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score += q.points;
      }
      if (q.type === 'single' && userAnswer === q.correctAnswer) {
        score += q.points;
      }
      if (q.type === 'multiple' && Array.isArray(userAnswer)) {
        const correct = q.correctAnswer.sort().join(',');
        const user = userAnswer.sort().join(',');
        if (correct === user) {
          score += q.points;
        }
      }
    });
    return score;
  };

  if (isFinished) {
    return (
      <div className="quiz-result">
        <h2>Результаты</h2>
        <p>Правильных ответов: {calculateScore()} из {quiz.questions.reduce((a, q) => a + q.points, 0)}</p>
        <button onClick={() => {
          setSelectedQuizIndex(null);
          setCurrentQuestionIndex(0);
          setAnswers([]);
          setIsFinished(false);
        }}>
          Пройти другую викторину
        </button>
      </div>
    );
  }

  return (
    <div className="take-quiz">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <button className="exit-button" onClick={() => setShowExitConfirm(true)}>×</button>
        <p>{quiz.description}</p>
      </div>

      <div className="question-box">
        <h3 className="question-text">Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</h3>
        <p className="question-content">{question.text}</p>

        <div className="answer-options">
          {question.type === 'single' && question.options.map((opt, i) => (
            <label key={i} className="answer-option">
              <input
                type="radio"
                name={`q-${currentQuestionIndex}`}
                checked={answers[currentQuestionIndex] === i}
                onChange={() => handleAnswerChange(i)}
              />
              <span>{opt}</span>
            </label>
          ))}

          {question.type === 'multiple' && question.options.map((opt, i) => (
            <label key={i} className="answer-option">
              <input
                type="checkbox"
                checked={answers[currentQuestionIndex]?.includes(i) || false}
                onChange={() => {
                  let current = answers[currentQuestionIndex] || [];
                  if (current.includes(i)) {
                    current = current.filter(index => index !== i);
                  } else {
                    current = [...current, i];
                  }
                  handleAnswerChange(current);
                }}
              />
              <span>{opt}</span>
            </label>
          ))}

          {question.type === 'text' && (
            <input
              type="text"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Введите ваш ответ..."
              className="text-answer-input"
            />
          )}
        </div>
      </div>

      <div className="nav-buttons spaced">
        {currentQuestionIndex > 0 && (
          <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
            ← Назад
          </button>
        )}
        {quiz.questions.length === 1 ? (
          <button onClick={handleFinish} style={{ backgroundColor: '#28a745' }}>
            Завершить
          </button>
        ) : currentQuestionIndex < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
            Далее →
          </button>
        ) : (
          <button onClick={handleFinish} style={{ backgroundColor: '#28a745' }}>
            Завершить
          </button>
        )}
      </div>

      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Вы уверены, что хотите выйти из теста?</p>
            <div className="modal-buttons">
              <button onClick={() => {
                handleFinish();
                setShowExitConfirm(false);
              }}>
                Да
              </button>
              <button onClick={() => setShowExitConfirm(false)}>Нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
