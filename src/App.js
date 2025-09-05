// Dispatcher Training Simulator with corrected scenario selection and Home button
import React, { useState, useEffect } from "react";
import "./styles.css";

const audioFiles = {
  0: "/audio/training-call-1.mp3",
  1: "/audio/training-call-2.mp3",
  2: "/audio/training-call-3.mp3",
  3: "/audio/training-call-4.mp3",
};

const toolsQuestions = [
  {
    id: 0,
    title: "Tools Question 1",
    driverText:
      "Driver COVSA calls in stating that their DIR load has not yet arrived in Vandalia. What tools could assist you in locating the trailer?",
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
      "Driver RINS calls in stating that the previous driver who had their load accidentally lost the paperwork. What tools could you use to find another copy to send over to him?",
    modelAnswer: `You could use JDA/Blue Yonder to download the MBOL (Master Bill of Lading) and email it to the driver. In more niche scenarios, checking customer service, in TMW, may yield pictures of the original BOL that could be used in a pinch. `,
  },
  {
    id: 6,
    title: "Tools Question 7",
    driverText:
      "99SINT calls in asking to confirm that their assigned BOL is ready. What tools can you use to verify that the trailer has been loaded?",
    modelAnswer: `You could pull the load up in Customer Service and click on the "Custom Def's" tab. While in that tab, check the "Trailer Loaded" box and see if there is a time stamp. You could also reference the ROAR report, for the shipping site, to see if there is a trailer assigned.`,
  },
  {
    id: 7,
    title: "Tools Question 8",
    driverText:
      "MOUM calls in asking for the location of a specific truck. What tools can you use to locate that specific unit?",
    modelAnswer: `You could use "Fleetview" inside of OT1 to search the location of a specific unit. You could also try checking the location in Penske Fleet Insight.`,
  },
  {
    id: 8,
    title: "Tools Question 9",
    driverText:
      "LUMM call is stating that they were involved in an accident involving another vehicle. What tools can you use to report the accident?",
    modelAnswer: `You could and should send in an accident report via the link on the CPC Logistics Onedrive page. You can also use Heymarket to send the Penske 24/7 line number to the driver.`,
  },
  {
    id: 9,
    title: "Tools Question 10",
    driverText:
      "Your supervisor informs you that one of your dispatches went into DISPERROR. What tools can you use to locate and clear out the error?",
    modelAnswer: `You could use the HUD in TMW via the command center to locate the DISPERROR. YOu could then use quick filters and customer service to find any other trips the driver is assigned/sent on.`,
  },
];

const sampleScenarios = [
  {
    id: 0,
    title: "Sample Scenario 1",
    driverText: "Please list the actions you can take to assist the driver.",
    modelAnswer: `Placeholder model answer for Sample Scenario 1.`,
  },
  {
    id: 1,
    title: "Sample Scenario 2",
    driverText: "Please list the actions you can take to assist the driver.",
    modelAnswer: `Placeholder model answer for Sample Scenario 2.`,
  },
  {
    id: 2,
    title: "Sample Scenario 3",
    driverText: "Please list the actions you can take to assist the driver.",
    modelAnswer: `Placeholder model answer for Sample Scenario 3.`,
  },
  {
    id: 3,
    title: "Sample Scenario 4",
    driverText: "Please list the actions you can take to assist the driver.",
    modelAnswer: "Model answer here...",
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
        question: scenario.driverText, // <-- Add this line
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
        {showDirectory && (
          <>
            <img src="/BouncingLogo.PNG" alt="CPC Logo" id="bouncing-logo" />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 2"
              id="bouncing-logo-2"
            />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 3"
              id="bouncing-logo-3"
            />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 4"
              id="bouncing-logo-4"
            />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 5"
              id="bouncing-logo-5"
            />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 6"
              id="bouncing-logo-6"
            />
            <img
              src="/BouncingLogo.PNG"
              alt="CPC Logo 7"
              id="bouncing-logo-7"
            />
          </>
        )}
        <div className="card">
          <p style={{ fontWeight: "bold" }}>
            Welcome to the team {firstName} {lastName}!
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
          disabled={submitted}
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
  const headers = [
    "Trainee",
    "Scenario Title",
    "Question",
    "Response",
    "Time Spent (s)",
  ];
  const rows = [];
  for (const [trainee, { responses, durations }] of Object.entries(data)) {
    [...sampleScenarios, ...toolsQuestions].forEach((s) => {
      rows.push([
        trainee,
        s.title,
        s.driverText,
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
