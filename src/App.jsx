import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../public/logo.jpg";
import { quizData } from "./quizData";
import "./App.css";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const next = currentQuestion + 1;
    if (next < quizData.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setStartQuiz(false);
  };

  const getLevel = (correct) => {
    if (correct >= 0 && correct <= 20) {
      return {
        level: "A1",
        scoreRange: "0% – 28%",
        ielts: "1.0 – 3.0",
        toefl: "0 – 31",
        sat: "200 – 350",
      };
    } else if (correct >= 21 && correct <= 30) {
      return {
        level: "A2",
        scoreRange: "30% – 43%",
        ielts: "3.5 – 4.0",
        toefl: "32 – 45",
        sat: "350 – 450",
      };
    } else if (correct >= 31 && correct <= 39) {
      return {
        level: "B1",
        scoreRange: "44% – 55%",
        ielts: "4.5 – 5.0",
        toefl: "46 – 59",
        sat: "450 – 500",
      };
    } else if (correct >= 40 && correct <= 49) {
      return {
        level: "B2",
        scoreRange: "57% – 70%",
        ielts: "5.5 – 6.5",
        toefl: "60 – 78",
        sat: "500 – 600",
      };
    } else if (correct >= 50 && correct <= 61) {
      return {
        level: "C1",
        scoreRange: "71% – 87%",
        ielts: "7.0 – 8.0",
        toefl: "79 – 95",
        sat: "600 – 650",
      };
    } else if (correct >= 62 && correct <= 70) {
      return {
        level: "C2",
        scoreRange: "88% – 100%",
        ielts: "8.5 – 9.0",
        toefl: "96 – 120",
        sat: "650 – 700",
      };
    } else {
      return {
        level: "Invalid",
        scoreRange: "N/A",
        ielts: "N/A",
        toefl: "N/A",
        sat: "N/A",
      };
    }
  };

  const generatePDF = () => {
    const report = document.getElementById("report");
    html2canvas(report, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // الصفحة الأولى
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // صفحات إضافية إن لزم
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save(`${name}_Quiz_Report.pdf`);
    });
  };
  

  if (!startQuiz) {
    return (
      <div className="start-screen">
        <div className="header">
          <img src={logo} alt="logo" />
          <div className="title">
            <h2>معهد برو لندن للتدريب و اللغات</h2>
            <p>Pro London Institute for Training and Languages</p>
          </div>
        </div>
        <h2>Enter your details to start the test</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="input-field"
        />
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="input-field"
        />
        <br />
        <button
          onClick={() => name && email && setStartQuiz(true)}
          className="button"
        >
          Start
        </button>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = score;
    const wrongAnswers = quizData.length - score;
    // const totalScore = score * 1;
    const { level, scoreRange, ielts, toefl, sat } = getLevel(correctAnswers);
    return (
      <div className="result-screen">
        <div id="report" className="report-container">
          <div className="report-header">
            <img src={logo} alt="logo" />
            <div>
              <h2>معهد برو لندن للتدريب و اللغات</h2>
              <p>Pro London Institute for Training and Languages</p>
            </div>
          </div>
          <hr />
          <h3>REPORT OF ENGLISH PLACEMENT TEST</h3>
          <h3>Pro London Institute</h3>
          <p className="tex">
            This is to certify that,<strong> Mr./Ms. {name} </strong>with the
            following credentials:
          </p>
          <p className="tex">
            <strong>Report date:</strong>{" "}
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
          </p>
          <p className="tex">
            <strong>User ID:</strong> {name}
          </p>
          <p className="tex">
            <strong>Email:</strong> {email}
          </p>
          <p className="tex">
            has successfully completed the English Placement Test conducted by
            <strong> Pro London Institute.</strong>
          </p>
          <p>
            <strong>Assessment Outcome</strong>
          </p>
          <p className="tex">
            The test evaluated the candidate’s English proficiency based on the
            <strong> Common European Framework of Reference (CEFR) </strong>
            standards. The candidate&#39;s performance is presented in the table
            below:
          </p>
          <p className="fast">
            <strong>Pro London Placement Test</strong>
          </p>
          <table className="report-table">
            <thead>
              <tr>
                <th>Pro London Level</th>
                <th>{level}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>IELTS Equivalence</th>
                <th>{ielts} / 9</th>
              </tr>
            </tbody>
          </table>
          <table className="report-table">
            <thead>
              <tr>
                <th>Score %</th>
                <th>{scoreRange}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>TOEFL iBT Equivalent</th>
                <th> {toefl} </th>
              </tr>
              <tr>
                <th>SAT: Reading / Writing</th>
                <th> {sat} </th>
              </tr>
            </tbody>
          </table>
          <table className="report-table">
            <thead>
              <tr>
                <th>You answered </th>
                <th>70/70</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Correct answers</th>
                <th>{correctAnswers} / 70</th>
              </tr>
              <tr>
                <th>Incorrect answers </th>
                <th>{wrongAnswers} / 70</th>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "left" }}>
            <p>
              <strong>Note:</strong>
            </p>
            <p>
              This report is based solely on the results of a placement test and
              is valid only for the individual named herein. It is intended for
              internal use by the applicant and the academic team at{" "}
              <strong> Pro London Institute.</strong>
            </p>
            <p>
              All rights and responsibilities regarding the interpretation and
              use of this assessment are reserved exclusively by{" "}
              <strong> Pro London Institute.</strong> Unauthorized sharing,
              reproduction, or distribution of this document is strictly
              prohibited.
            </p>
          </div>
          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <p>
              Thank you for choosing <strong> Pro London Institute</strong> as
              your trusted language learning partner.
            </p>
          </div>

          <hr />
          <div className="footer-note">
            <p>
              Pro London Institute - Al Ain - Al Bateen - Extra Market, U.A.E
            </p>
            <p>Phone: +971 568 044 683</p>
          </div>
        </div>

        <button onClick={generatePDF} className="button">
          Download the report PDF
        </button>
        <br />
        <button onClick={handleRestart} className="button">
          Retest{" "}
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <img src={logo} alt="logo" />
        <div className="title">
          <h2>معهد برو لندن للتدريب و اللغات</h2>
          <p>Pro London Institute for Training and Languages</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection:"column-reverse",
        }}
      >
        <p style={{ fontSize: "24px" }}>
          <strong> Choose the best answer: </strong>
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong> {currentQuestion + 1} </strong> / {quizData.length}
        </p>
      </div>
      <h2 className="ques">{quizData[currentQuestion].question}</h2>
      <div className="options">
        {quizData[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.isCorrect)}
            className="button"
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
