import React, { useState } from 'react';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [addingQuestions, setAddingQuestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('single');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [correctTextAnswer, setCorrectTextAnswer] = useState('');
  const [points, setPoints] = useState(1);
  const [tags, setTags] = useState('');
  
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const startQuizCreation = () => setQuizStarted(true);

  const handleAddQuestion = () => {
    if (questionText.trim() === '') {
      alert('Введите текст вопроса.');
      return;
    }

    if (questionType === 'text') {
      if (correctTextAnswer.trim() === '') {
        alert('Введите правильный текстовый ответ.');
        return;
      }
    } else {
      const trimmedOptions = options.map(opt => opt.trim());

      if (trimmedOptions.some(opt => opt === '')) {
        alert('Все варианты ответа должны быть заполнены.');
        return;
      }

      if (questionType === 'single') {
        if (correctAnswer === null || correctAnswer < 0 || correctAnswer >= trimmedOptions.length) {
          alert('Выберите правильный ответ.');
          return;
        }
      }

      if (questionType === 'multiple') {
        if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
          alert('Выберите хотя бы один правильный ответ.');
          return;
        }
      }
    }

    const newQuestion = {
      text: questionText,
      type: questionType,
      options: questionType === 'text' ? [] : options,
      correctAnswer: questionType === 'text' ? correctTextAnswer : correctAnswer,
      points,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText('');
    setQuestionType('single');
    setOptions(['', '']);
    setCorrectAnswer(null);
    setCorrectTextAnswer('');
    setPoints(1);
  };

  const handleTagsChange = (e) => setTags(e.target.value);

  const handleDeleteOption = (index) => {
    if (options.length === 2) {
      alert('Нельзя удалить вариант, так как должно быть хотя бы два варианта ответа.');
      return;
    }

    const newOptions = options.filter((_, i) => i !== index);

    // Обновляем правильные ответы
    if (questionType === 'single') {
      setCorrectAnswer(correctAnswer === index ? null : correctAnswer > index ? correctAnswer - 1 : correctAnswer);
    } else if (questionType === 'multiple' && Array.isArray(correctAnswer)) {
      const updatedCorrect = correctAnswer
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i));
      setCorrectAnswer(updatedCorrect);
    }

    setOptions(newOptions);
  };

  const saveQuiz = () => {
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (questions.length === 0) {
      alert('Добавьте хотя бы один вопрос перед сохранением викторины.');
      return;
    }

    const newQuiz = {
      title: quizTitle,
      description: quizDescription,
      questions,
      tags: tagsArray,
    };

    const updatedQuizzes = [newQuiz, ...quizzes];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    alert('Quiz сохранён!');
    setQuizStarted(false);
    setAddingQuestions(false);
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([]);
    setTags('');
  };

  const handleDeleteQuiz = (index) => {
    const updated = quizzes.filter((_, i) => i !== index);
    setQuizzes(updated);
    localStorage.setItem('quizzes', JSON.stringify(updated));
  };

  return (
    <div className="create-quiz">
      {!quizStarted ? (
        <>
          <button onClick={startQuizCreation} className="start-btn">+ Create Quiz</button>

          {quizzes.length > 0 && (
            <>
              <h3>Текущие викторины:</h3>
              <div className="quiz-list">
                {quizzes.map((quiz, index) => (
                  <div key={index} className="quiz-entry">
                    <span>{quiz.title}</span>
                    <button onClick={() => alert('Редактирование пока не реализовано')}>Редактировать</button>
                    <button onClick={() => handleDeleteQuiz(index)}>Удалить</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : !addingQuestions ? (
        <>
          <h2>Создание новой викторины</h2>
          <div className="form-group">
            <label>Название викторины:</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Например: 'Тест по истории'"
            />
          </div>
          <div className="form-group">
            <label>Описание (необязательно):</label>
            <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Краткое описание теста..."
            />
          </div>
          <div className="form-group">
            <label>Теги (через запятую):</label>
            <input
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="Введите теги, разделённые запятой"
            />
          </div>
          <button
            onClick={() => {
              if (quizTitle.trim() === '') {
                alert('Пожалуйста, введите название викторины.');
                return;
              }
              setAddingQuestions(true);
            }}
          >
            Добавить вопросы
          </button>
          <button onClick={() => setQuizStarted(false)} style={{ marginLeft: '10px' }}>Отмена</button>
        </>
      ) : (
        <>
          <h2>Добавить вопрос</h2>
          <div className="form-group">
            <label>Текст вопроса:</label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Тип вопроса:</label>
            <label><input type="radio" value="single" checked={questionType === 'single'} onChange={(e) => setQuestionType(e.target.value)} /> Один ответ</label>
            <label><input type="radio" value="multiple" checked={questionType === 'multiple'} onChange={(e) => setQuestionType(e.target.value)} /> Множественный выбор</label>
            <label><input type="radio" value="text" checked={questionType === 'text'} onChange={(e) => setQuestionType(e.target.value)} /> Текстовый</label>
          </div>

          {(questionType === 'single' || questionType === 'multiple') && (
            <div className="form-group">
              {options.map((opt, i) => (
                <div key={i} className="option-item">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Вариант ${i + 1}`}
                  />
                  <input
                    type={questionType === 'single' ? 'radio' : 'checkbox'}
                    checked={
                      questionType === 'single'
                        ? correctAnswer === i
                        : correctAnswer?.includes(i)
                    }
                    onChange={() => {
                      if (questionType === 'single') {
                        setCorrectAnswer(i);
                      } else {
                        const updated = correctAnswer?.includes(i)
                          ? correctAnswer.filter((idx) => idx !== i)
                          : [...(correctAnswer || []), i];
                        setCorrectAnswer(updated);
                      }
                    }}
                  />
                  <span>Правильный</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(i)}
                    className="delete-option-btn"
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button onClick={() => setOptions([...options, ''])}>+ Добавить вариант</button>
            </div>
          )}

          {questionType === 'text' && (
            <div className="form-group">
              <label>Правильный текст:</label>
              <input
                type="text"
                value={correctTextAnswer}
                onChange={(e) => setCorrectTextAnswer(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Баллы за вопрос:</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </div>

          <button onClick={handleAddQuestion}>Добавить вопрос</button>
          <button onClick={saveQuiz} style={{ marginLeft: '10px', backgroundColor: '#28a745' }}>Сохранить Quiz</button>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;
