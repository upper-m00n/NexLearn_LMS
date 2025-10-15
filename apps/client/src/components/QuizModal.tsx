// src/components/QuizModal.tsx
'use client';

import { useState } from 'react';

// Define types for better code quality
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  id: string;
  questions: Question[];
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizData;
}

const QuizModal = ({ isOpen, onClose, quizData }: QuizModalProps) => {
  // --- State Management ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;

  // --- Logic Handlers ---
  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    let finalScore = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (selectedAnswers[i] === quizData.questions[i].correctAnswer) {
        finalScore++;
      }
    }
    setScore(finalScore);
    setIsFinished(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Lecture Quiz</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!isFinished ? (
            // --- Quiz View ---
            <div>
              <p className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // --- Results View ---
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
              <p className="text-4xl font-bold mb-6">
                Your Score: {score} / {totalQuestions}
              </p>
              {/* Optional: Show a review of the answers */}
              <div className="text-left space-y-4">
                {quizData.questions.map((q, i) => (
                  <div key={q.id} className="p-3 rounded-lg border">
                    <p className="font-semibold">{i + 1}. {q.text}</p>
                    <p className={`mt-1 text-sm ${
                      selectedAnswers[i] === q.correctAnswer ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Your answer: {q.options[selectedAnswers[i]] || 'Not answered'}
                    </p>
                    {selectedAnswers[i] !== q.correctAnswer && (
                      <p className="mt-1 text-sm text-green-700">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-3">
          {!isFinished ? (
            <>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
                >
                  Submit
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={handleRestart} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
                Restart Quiz
              </button>
              <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">
                Finish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;