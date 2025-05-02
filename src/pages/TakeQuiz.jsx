import React, { useEffect, useState } from 'react';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ score: 0, total: 0, correct: 0, wrong: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizzes')) || [];
    setQuizzes(saved);
  }, []);

  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setAnswers({});
    setShowResult(false);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;

    currentQuiz.questions.forEach((q, i) => {
      const userAnswer = answers[i];

      if (q.type === 'single') {
        if (userAnswer === q.correctAnswer) {
          score += q.points;
          correct++;
        } else {
          wrong++;
        }
      } else if (q.type === 'multiple') {
        const correctSet = new Set(q.correctAnswer);
        const userSet = new Set(userAnswer || []);
        const isCorrect =
          correctSet.size === userSet.size &&
          [...correctSet].every((val) => userSet.has(val));

        if (isCorrect) {
          score += q.points;
          correct++;
        } else {
          wrong++;
        }
      } else if (q.type === 'text') {
        if (String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          score += q.points;
          correct++;
        } else {
          wrong++;
        }
      }
    });

    setResult({ score, total: currentQuiz.questions.length, correct, wrong });
    setShowResult(true);
  };

  if (!currentQuiz) {
    return (
      <div className="take-quiz">
        <h2>Доступные викторины</h2>
        {quizzes.length === 0 ? (
          <p>Нет доступных тестов.</p>
        ) : (
          quizzes.map((quiz, index) => (
            <div key={index} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button onClick={() => handleStartQuiz(quiz)}>Пройти</button>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="take-quiz">
      <h2>{currentQuiz.title}</h2>

      {showResult ? (
        <div className="results">
          <h3>Результаты</h3>
          <p>Правильных: {result.correct}</p>
          <p>Неправильных: {result.wrong}</p>
          <p>Общий счёт: {result.score}</p>
          <button onClick={() => setCurrentQuiz(null)}>Назад к списку</button>
        </div>
      ) : (
        <>
          {currentQuiz.questions.map((q, i) => (
            <div key={i} className="question-block">
              <p><strong>{i + 1}. {q.text}</strong></p>

              {q.type === 'single' &&
                q.options.map((opt, idx) => (
                  <label key={idx}>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={idx}
                      checked={answers[i] === idx}
                      onChange={() => handleAnswerChange(i, idx)}
                    />
                    {opt}
                  </label>
                ))}

              {q.type === 'multiple' &&
                q.options.map((opt, idx) => (
                  <label key={idx}>
                    <input
                      type="checkbox"
                      checked={answers[i]?.includes(idx)}
                      onChange={() => {
                        const prev = answers[i] || [];
                        const updated = prev.includes(idx)
                          ? prev.filter((x) => x !== idx)
                          : [...prev, idx];
                        handleAnswerChange(i, updated);
                      }}
                    />
                    {opt}
                  </label>
                ))}

              {q.type === 'text' && (
                <input
                  type="text"
                  value={answers[i] || ''}
                  onChange={(e) => handleAnswerChange(i, e.target.value)}
                />
              )}
            </div>
          ))}

          <button onClick={handleSubmit}>Отправить</button>
        </>
      )}
    </div>
  );
};

export default TakeQuiz;
