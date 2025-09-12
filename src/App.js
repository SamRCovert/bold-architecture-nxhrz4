// Dispatcher Training Simulator with corrected scenario selection and Home button
import React, { useState, useEffect } from "react";
import "./styles.css";
const changelogText = `
v1.5 - Finished adding terms and definitions to "Study Guide"
v1.4 - Fixed array portion of "Study Guide" to limit terms
v1.3 - Added SOP module with working links
v1.2 - Added flash cards inside the study guide module
v1.1 - Added 4 sample phone call files 
v1 - Finished 10 Tools questions with answers
`;
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
    modelAnswer: `You could use the HUD in TMW via the command center to locate the DISPERROR. You could then use quick filters and customer service to find any other trips the driver is assigned/sent on.`,
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
    {
      term: "TMW",
      definition:
        "(AKA TruckMate- CPC's dispatching and load assignment software that is launched through the remote desktop)",
    },
    {
      term: "Road Ready/Fusion",
      definition:
        "(Trailer tracking software that goes off of pings to provide locations and timestamps)",
    },
    {
      term: "OT1",
      definition:
        "(AKA Omnitracs- CPC's driver centric system that feeds into and feeds from TMW. Used by drivers to log hours, activate loads, ETC.)",
    },
    {
      term: "Dialpad",
      definition:
        "(Dispatcher phone system that directs driver phone calls to dispatchers determined by a queue system)",
    },
    {
      term: "Heymarket",
      definition:
        "(Dispatcher text system that can send and receive sms messages)",
    },
    {
      term: "Remote Desktop",
      definition:
        "(Application pre-installed on the company issues laptops that allows you to launch TMW, Command Centers, Customer Service, ETC.)",
    },
    {
      term: "DRV_SHIFT",
      definition:
        "(Command center page within the Remote Desktop that shows driver and assignment information depending on parametes set)",
    },
    {
      term: "JDA/Blue Yonder",
      definition:
        "(P&G's system that shows In-Transit and Tendered loads. Can also be used to print paperwork.)",
    },
    {
      term: "ROAR Report",
      definition:
        "(Reports released by a select number of P&G sites sent directly to our shared email that details each trailer currently on the lot)",
    },
    {
      term: "Quick Filters",
      definition:
        "(Filters within the trip grid in TMW that allows you to narrow your search for available/already assigned loads)",
    },
    {
      term: "Customer Service",
      definition:
        "(Page within the remote desktop that shows most available information about a specific load)",
    },
    {
      term: "HUD",
      definition:
        "(Command center page within the Remote Desktop that gives a quick overview of trip statuses and overall grid health)",
    },
    {
      term: "Penske Fleet Insight",
      definition:
        "(Penske's website specifically tailored to display CPC/P&G's fleet of tractors and trailers. Displays updated service information on said units)",
    },
    {
      term: "Standby",
      definition:
        "(Driver status in TMW that asks for a driver to be available, from their home, for two hours past their pull time. If sent a dispatch during that time, they would be expected to run it)",
    },
    {
      term: "Report",
      definition:
        "(Driver status in TMW that asks for a driver to be available, from the yard/domicile, for two hours past their pull time. If sent a dispatch during that time, they would be expected to run it)",
    },
    {
      term: "Empty",
      definition:
        "(Assignment for drivers to pull an empty trailer, not loaded with any product, from one location to another)",
    },
    {
      term: "Bobtail",
      definition:
        "(Assignment for drivers to drive without a trailer attached, usually due to an empty and load not being available, from one location to another)",
    },
    {
      term: "Attendance Tracker",
      definition:
        "(Microsoft form, located in the Sharepoint, that dispatchers are to fill out when a driver calls off, ends their report or standby, goes home early, ETC.)",
    },
  ];

  const [expanded, setExpanded] = useState(null);
  const [showFlashCard, setShowFlashCard] = useState(false);
  const [usedIndexes, setUsedIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  const handleNextFlashCard = () => {
    if (usedIndexes.length >= terms.length) {
      setCurrentIndex(null);
      return;
    }

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * terms.length);
    } while (usedIndexes.includes(newIndex));

    setUsedIndexes([...usedIndexes, newIndex]);
    setCurrentIndex(newIndex);
    setUserInput("");
    setRevealed(false);
  };

  const handleSubmit = () => {
    setRevealed(true);

    console.log("Submitted:", {
      term: terms[currentIndex].term,
      userInput,
      correctAnswer: terms[currentIndex].definition,
    });
  };

  const handleStartFlashCards = () => {
    setShowFlashCard(true);
    handleNextFlashCard();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Study Guide</h2>

        {/* Show Study List */}
        {!showFlashCard && (
          <>
            {terms.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => setExpanded(expanded === index ? null : index)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "5px",
                  }}
                >
                  {item.term}
                </button>
                {expanded === index && (
                  <div
                    style={{
                      paddingLeft: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <em>{item.definition}</em>
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: "20px" }}>
              <button onClick={handleStartFlashCards}>Start Flash Cards</button>
            </div>
          </>
        )}

        {/* Flash Card UI */}
        {showFlashCard && (
          <div
            style={{
              border: "1px solid #aaa",
              borderRadius: "8px",
              padding: "20px",
              marginTop: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {currentIndex === null ? (
              <div>
                <p>
                  <strong>You've completed all flash cards!</strong>
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: "10px" }}>
                  Term: {terms[currentIndex].term}
                </h3>
                <input
                  type="text"
                  placeholder="Type your definition..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
                {!revealed ? (
                  <button onClick={handleSubmit}>Reveal Answer</button>
                ) : (
                  <>
                    <p>
                      <strong>Correct:</strong> {terms[currentIndex].definition}
                    </p>
                    <button onClick={handleNextFlashCard}>Next</button>
                  </>
                )}
              </>
            )}
          </div>
        )}

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
  const [showSOP, setShowSOP] = useState(false);
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
        question: scenario.driverText,
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
  if (showSOP) {
    return (
      <div className="container">
        <div className="card">
          <h2>SOP Resources</h2>

          {[
            {
              name: "Re-plan/Driver call off process",
              url: "https://scribehow.com/viewer/Re-PlanDriver_Call_Off_Process_04-24-2025__rBLiWG1cRDOR-m4uZdaFZw?referrer=documents",
            },
            {
              name: "Finding location addresses in TMW",
              url: "https://scribehow.com/viewer/Finding_an_Address_for_any_Location_Using_the_OPS_Command_Center__olOQNAOAQ8SRFNJG0qEA7g?referrer=documents",
            },
            {
              name: "Sending loads and monitoring drivers using DRV_SHIFT",
              url: "https://scribehow.com/viewer/Sending_Loads_and_Monitoring_Drivers_Via_DRVSHIFT__jteIzCbVRxWFAqecyBwLwQ?referrer=documents",
            },
            {
              name: "Walking a load through in TMW",
              url: "https://scribehow.com/viewer/Walking_a_load_through_to_send_to_the_second_driver_on_a_trip__mCWmPv6bTlezZxSWoKUrJQ?referrer=documents",
            },
            {
              name: "Using quick filters",
              url: "https://scribehow.com/viewer/Using_Quick_Filters_on_the_Freight_Bills_Grid__GX8O2cECQ1yBwEdp9D3xjQ?referrer=documents",
            },
            {
              name: "Removing a driver from a special event",
              url: "https://scribehow.com/viewer/Removing_a_Driver_From_an_Expired_Special_Event__9CfpAe4KTw6xwQphZoojoA?referrer=documents",
            },
            {
              name: "Placeholder for next SOP",
              url: "https://scribehow.com/viewer/Walking_a_load_through_to_send_to_the_second_driver_on_a_trip__mCWmPv6bTlezZxSWoKUrJQ?referrer=documents",
            },
          ].map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="menu-button"
              style={{ display: "block", marginBottom: "10px" }}
            >
              {item.name}
            </a>
          ))}

          <button
            className="menu-button"
            onClick={() => {
              setShowSOP(false);
              setShowDirectory(true);
            }}
            style={{ marginTop: "20px" }}
          >
            Back
          </button>
        </div>
      </div>
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
            Log In
          </button>

          <button
            onClick={() => alert(changelogText)}
            style={{
              marginTop: "10px",
              backgroundColor: "#eee",
              color: "#000",
            }}
          >
            View Changelog
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
          <button
            onClick={() => {
              setShowDirectory(false);
              setShowSOP(true);
            }}
            style={{ marginTop: "10px" }}
          >
            SOP's
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
          <div style={{ marginBottom: "10px" }}>
            <img
              src="/play-icon-v2.png?v=2"
              alt="Play"
              style={{ cursor: "pointer", width: "200px" }}
              onClick={() => {
                const audio = document.getElementById(`audio-${scenario.id}`);
                if (audio) {
                  audio.play();
                }
              }}
            />
            <audio
              id={`audio-${scenario.id}`}
              src={audioFiles[scenario.id]}
              style={{ display: "none" }}
            />
          </div>
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
