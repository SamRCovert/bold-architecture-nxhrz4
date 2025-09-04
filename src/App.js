// Dispatcher Training Simulator with corrected scenario selection and Home button
import React, { useState, useEffect } from "react";
import "./styles.css";

const audioFiles = {
  1: "/file_example_MP3_1MG.mp3",
  2: "/sample-12s%20Scenario%202%20test.mp3",
  3: "/sample-15s%20Scenario%203%20test.mp3",
  // No audio for toolsQuestions[1]
};

const toolsQuestions = [
  {
    id: 0,
    title: "Tools Question 1",
    driverText:
      "Driver COVSA calls in stating that their DIR load has not yet arrived in Vandalia. What tools could assist you in locating the BOL?",
    modelAnswer: `Road Ready/Fusion to Track trailers last pinged location
TMW Trip Grid to Locate the previous driver's ID that was assigned to the BOL
OT1 to Check the driver logs for the previously assigned driver`,
  },
  {
    id: 1,
    title: "Tools Question 2",
    driverText:
      "You are asked to contact a driver directly. What tools can you use to get in touch?",
    modelAnswer: `HeyMarket to text the driver, Dialpad to call the driver's phone, OT1 centralized messaging to send a message to the driver's truck if they are logged in.`,
  },
  {
    id: 2,
    title: "Tools Question 3",
    driverText:
      "Driver SHOJO calls in stating that another driver told them that truck number 324156 was previously damaged. What tools could you utilize to check the status of the truck?",
    modelAnswer: `Penske Fleet Insight would have the most recent work orders and statuses, and you could check DVIR reports in OT1 to see if the previous driver pre-tripped any issues. `,
  },
  {
    id: 3,
    title: "Tools Question 4",
    driverText:
      "Driver QUIG calls in stating that they need a new load from the St. Clairsville drop lot to Vandalia. What tools could you use to find them a new BOL?",
    modelAnswer: `You could utilize your TMW quick filters, Leg From and Leg To, and find a BOL that is in St. Clairsville needing to go to Vandalia. You could then use Road Ready/Fusion to verify the location of the trailer.`,
  },
  {
    id: 4,
    title: "Tools Question 5",
    driverText:
      "You are asked to review log in times for driver's starting out of Shippensburg. What tools would you use to quickly check that the driver's logged in?  ",
    modelAnswer: `You should utilize the DRV_SHIFT command center and set your parameters for drivers starting out of Shippensburg. You could also check specific drivers in OT1 using the Driver Log Editor. `,
  },
  {
    id: 5,
    title: "Tools Question 6",
    driverText:
      "You’re tracking a relay and want to confirm if the handoff was successful. What tools would help verify the status of both drivers and the trailer?",
    modelAnswer: `OT1 to check relay comments, timestamps, and equipment
Road Ready to track trailer location
TMW to verify both drivers' statuses and trip segments`,
  },
  {
    id: 6,
    title: "Tools Question 7",
    driverText:
      "A planner asks you to check whether a driver can legally deliver a load by a specific ETA. What tools would you reference to determine hours of service availability?",
    modelAnswer: `OT1 Log Viewer to check the driver's available hours
DRV_SHIFT to see who is scheduled and current shifts
TMW ETA projection tools`,
  },
  {
    id: 7,
    title: "Tools Question 8",
    driverText:
      "You need to confirm if a trailer is empty and ready for the next load. What tools would you use to verify that status?",
    modelAnswer: `TMW Trailer Dashboard to check current trailer status
OT1 Equipment View for updates from the driver
ROAR trailer reports for yard inventory status`,
  },
  {
    id: 8,
    title: "Tools Question 9",
    driverText:
      "A new hire is trying to find their assigned truck in a large yard. What tools can help them locate it?",
    modelAnswer: `Road Ready or Fusion for last GPS ping
TMW to cross-check truck assignments
Dispatch Notes in OT1 for additional handoff instructions`,
  },
  {
    id: 9,
    title: "Tools Question 10",
    driverText:
      "A driver is stuck at a shipper and wants to know how long they’ve been on site. What tools could you use to verify and track their detention time?",
    modelAnswer: `OT1 timestamps from check-in logs
TMW Order Time Stamps (Arrived/Loaded times)
Yard Management Systems or Shipper Portals if available`,
  },
];

const sampleScenarios = [
  {
    id: 1,
    title: "Sample Scenario 1",
    driverText: "This is a placeholder driver message for sample scenario 1.",
    modelAnswer: `Placeholder model answer for Sample Scenario 1.`,
  },
  {
    id: 2,
    title: "Sample Scenario 2",
    driverText: "This is a placeholder driver message for sample scenario 2.",
    modelAnswer: `Placeholder model answer for Sample Scenario 2.`,
  },
  {
    id: 3,
    title: "Sample Scenario 3",
    driverText: "This is a placeholder driver message for sample scenario 3.",
    modelAnswer: `Placeholder model answer for Sample Scenario 3.`,
  },
];
function StudyGuide({ onBack }) {
  const terms = [
    "TMW",
    "Road Ready/Fusion",
    "OT1",
    "Dialpad",
    "Heymarket",
    "Penske Fleet Insight",
    "DRV_SHIFT",
    "JDA/Blue Yonder",
    ...Array.from({ length: 12 }, (_, i) => `Term ${i + 9}`),
  ];
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="container">
      <div className="card">
        <h2>Study Guide</h2>
        {terms.map((term, index) => (
          <div key={index}>
            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              style={{ width: "100%", textAlign: "left", marginBottom: "5px" }}
            >
              {term}
            </button>
            {expanded === index && (
              <div style={{ paddingLeft: "10px", marginBottom: "10px" }}>
                <em>Placeholder definition for {term}...</em>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: "20px" }}>
          <button onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isNamed, setIsNamed] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [trainingType, setTrainingType] = useState(null);
  const [current, setCurrent] = useState(0);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [responses, setResponses] = useState({});
  const [durations, setDurations] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [allTrainees, setAllTrainees] = useState(() => {
    const saved = localStorage.getItem("allTraineeData");
    return saved ? JSON.parse(saved) : {};
  });
  const [hasExported, setHasExported] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  const activeScenarioSet =
    trainingType === "sample" ? sampleScenarios : toolsQuestions;
  const scenario = activeScenarioSet[current];

  useEffect(() => {
    setStartTime(Date.now());
    setResponse("");
    setSubmitted(false);
  }, [current]);

  useEffect(() => {
    if (completed && !hasExported) {
      exportToCSV(allTrainees);
      setHasExported(true);
    }
  }, [completed, hasExported, allTrainees]);

  const handleSubmit = () => {
    if (!response.trim()) {
      alert("Please enter a response before submitting.");
      return;
    }
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    const traineeName = `${firstName} ${lastName}`;
    const updatedResponses = {
      ...(allTrainees[traineeName]?.responses || {}),
      [scenario.id]: response,
    };
    const updatedDurations = {
      ...(allTrainees[traineeName]?.durations || {}),
      [scenario.id]: timeSpent,
    };
    const updatedAllTrainees = {
      ...allTrainees,
      [traineeName]: {
        responses: updatedResponses,
        durations: updatedDurations,
      },
    };
    setAllTrainees(updatedAllTrainees);
    setResponses(updatedResponses);
    setDurations(updatedDurations);
    localStorage.setItem("allTraineeData", JSON.stringify(updatedAllTrainees));
    const sheetBestUrl =
      "https://api.sheetbest.com/sheets/e58724c9-1ad0-4152-8272-a69961763a74";

    fetch(sheetBestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainee: `${firstName} ${lastName}`,
        scenario: scenario.title,
        response: response,
        timeSpent: timeSpent,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Sent to Google Sheets:", data))
      .catch((err) => console.error("❌ Error sending to Google Sheets:", err));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (current + 1 >= activeScenarioSet.length) {
      setCompleted(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleRestart = () => {
    setIsNamed(false);
    setFirstName("");
    setLastName("");
    setShowDirectory(false);
    setShowInstructions(false);
    setTrainingType(null);
    setCurrent(0);
    setCompleted(false);
    setResponses({});
    setDurations({});
    setSubmitted(false);
    setHasExported(false);
  };

  const handleReturnHome = () => {
    if (window.confirm("Returning home will reset progress. Are you sure?")) {
      setShowInstructions(false);
      setCurrent(0);
      setCompleted(false);
      setResponses({});
      setDurations({});
      setSubmitted(false);
      setShowDirectory(true);
    }
  };

  if (showStudyGuide) {
    return (
      <StudyGuide
        onBack={() => {
          setShowStudyGuide(false);
          setShowDirectory(true);
        }}
      />
    );
  }

  if (!isNamed && !showDirectory) {
    return (
      <div className="container">
        <div className="card">
          <img src="/CPC ICON.PNG" alt="CPC Icon" className="login-logo" />
          <h2>Enter Your Full Name to Begin</h2>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <button
            onClick={() => {
              if (firstName && lastName) setShowDirectory(true);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (showDirectory) {
    return (
      <div className="container" style={{ position: "relative" }}>
        <div className="card">
          <p style={{ fontWeight: "bold" }}>
            Welcome {firstName} {lastName}
          </p>
          <h2>Select a Training Module</h2>
          <button
            onClick={() => {
              setTrainingType("sample");
              setShowInstructions(true);
              setIsNamed(true);
              setShowDirectory(false);
              setCurrent(0);
            }}
          >
            Sample Call Test
          </button>
          <button
            onClick={() => {
              setTrainingType("tools");
              setShowInstructions(true);
              setIsNamed(true);
              setShowDirectory(false);
              setCurrent(0);
            }}
          >
            Which Tools Test
          </button>
          <button
            onClick={() => {
              setShowDirectory(false);
              setShowStudyGuide(true);
            }}
            style={{ marginTop: "10px" }}
          >
            Study Guide
          </button>
          <button onClick={handleRestart} style={{ marginTop: "10px" }}>
            Log Out
          </button>
        </div>
        );
      </div>
    );
  }

  if (showInstructions) {
    if (trainingType === "tools") {
      return (
        <div className="container">
          <div className="card">
            <h2>Tools Test Instructions</h2>
            <p>
              This test will ask you to name the most useful tools for each
              scenario listed. Please name as many that come to mind that could
              be utilized and explain what you would use each of them for.
            </p>
            <button onClick={() => setShowInstructions(false)}>
              Start Tools Test
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <div className="card">
          <h2>Instructions</h2>
          <p>
            This exercise will put you through several mock phone calls from
            drivers. Please answer to the best of your ability and reference
            specific tools you may be able to use to assist the driver.
          </p>
          <button onClick={() => setShowInstructions(false)}>
            Start Training
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="container">
        <div className="card">
          <h2>🎉 Congratulations!</h2>
          <p>You have completed the training exercise.</p>
          <button onClick={handleReturnHome}>Restart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ position: "absolute", bottom: 20, left: 20 }}>
        <button onClick={handleRestart}>Log Out</button>
      </div>
      <div style={{ position: "absolute", bottom: 20, right: 20 }}>
        <button onClick={handleReturnHome}>Return Home</button>
      </div>
      <div className="card">
        <h2>{scenario.title || `Scenario ${scenario.id}`}</h2>
        {trainingType === "sample" && audioFiles[scenario.id] && (
          <audio
            key={audioFiles[scenario.id]}
            controls
            style={{ display: "block", marginBottom: "10px" }}
          >
            <source src={audioFiles[scenario.id]} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {scenario.driverText && <p> {scenario.driverText}</p>}
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response here..."
        />
        {!submitted ? (
          <button onClick={handleSubmit}>Submit Response</button>
        ) : (
          <>
            <div className="model-answer">
              <strong>Model Answer:</strong>
              <p>{scenario.modelAnswer}</p>
            </div>
            <button onClick={handleNext}>Next Scenario</button>
          </>
        )}
      </div>
    </div>
  );
}

function exportToCSV(data) {
  const headers = ["Trainee", "Scenario", "Response", "Time Spent (s)"];
  const rows = [];
  for (const [trainee, { responses, durations }] of Object.entries(data)) {
    [...sampleScenarios, ...toolsQuestions].forEach((s) => {
      rows.push([
        trainee,
        s.title,
        responses[s.id] || "",
        durations[s.id] || 0,
      ]);
    });
  }
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "trainee_responses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
