
// ----------------- Test 1

// 1.
// answer: [1, 2, 3]
// map returns an array from an array, which is stored in testArray, since the arrow func is on a single line it does not need the return keyword

// 2.
const isOverTen = (number) => {
  if (typeof number !== "number") {
   throw new TypeError("Insert a number")
  }

  if (number >= 10) {
    return true;
  } else {
    return false;
  }
};

// 3.
// Both are class components, modern React uses the right arrow function version () => {} 
// You would use the left in slightly older codebases
// For the left, you would also have to manually define the constructor and handle mounting manually with DidMount, WillUnmount, etc.

// 4. 
// Any API request would be written above the return statement, but below the start of where the component is defined
// I would also use the info from JSON file here, BUT for these static files I would actually import them at the top, BEFORE the component entirely.


// 5. 
// JS Promises are returned when we use a fetch and also any following .then()
// Promises allow for easier handling of async events such as retrieving data from an API
// It is key that a Promise can be in one of three states, pending/fulfilled/rejected which allows us to easily view the state of our requests and 
// where it has potentially gone wrong. It also allows us .catch rejections for further handling.


// 6.
// Proportionally, let's say the [-] is a single unit of space, where [--] is double [-]
// Answer: [-][-][--], in order blue, red, yellow, FROM LEFT TO RIGHT on the entire page since default flex-direction is row in React (but column in React Native).
// Flex with a single number will automatically resize to fill the space which is left for it after defining other elements
// Flex with the same number will be of the same size and will be in proportion to other flex of other numbers eg. 1:1:2 in this case



// ----------------- Test 2

// 1a. in Test.jsx
// Refactored to instead take an argument called inputData in processData, allows it to become easily testable
// Changed the onClick to also reflect this, so that original functioning would not break
import React, { useState } from "react";
import { processData } from "./Test.js";

const Test = () => {
  const [data, setData] = useState([
    { value: 2, multiplier: 2 },
    { value: 3, multiplier: 3 },
  ]);

  const handleProcessData = () => {
    setData(processData(data));
  };

  return (
    <div>
      {JSON.stringify(data)}
      <button type="button" onClick={handleProcessData}>
        Run
      </button>
    </div>
  );
};

export default Test;

// 1b. in TestFunctions.js
// Separated to be able to test
export const processData = (inputData) => {
  const newData = [];
  inputData.forEach((e) =>
    newData.push({ value: e.value * e.multiplier, multiplier: e.multiplier })
  );
  return newData;
};


// 1c. in Test.test.js
// Two basic tests, first describe block checks the component renders, second answers the question
// Both pass correctly
import React from "react";
import { shallow } from "enzyme";
import Test from "./Test.jsx";
import { processData } from "./TestFunctions.js";

describe("Test tests", () => {
  // separate, but tests that the function renders
  let component;

  beforeEach(() => {
    component = shallow(<Test />);
  });

  it("should render", () => {
    expect(component).toBeTruthy();
  });
});

describe("Test processData function", () => {
  it("should return the correct value for { value: 2, multiplier: 2 }", () => {
    expect(processData([{ value: 2, multiplier: 2 }])).toEqual([
      { value: 4, multiplier: 2 },
    ]);
  });
});



// 2.
// I've not added the CSS, but I usually use SCSS modules alongside CSS imports to style components as it prevents leakage, example usage is shown

import React, { useState, useEffect } from "react";
import styles from "./Test.module.scss";

const Test = () => {
  const [data, setData] = useState([]); // original data from fetch
  const [filterSearch, setFilterSearch] = useState([]); // object list filtered from data
  const [dataRender, setDataRender] = useState([]); // actual JSX results render
  const [searchString, setSearchString] = useState(""); // string from search input

  // get API data once
  useEffect(() => {
    fetch("http://search.com/data").then((res) => setData(res.json()));
  }, []);

  // runs in the following useEffect to update as user searches
  const handleSearch = () => {
    const newSearch = [];

    for (let i = 0; i < data.length; i++) {
      try {
        if (
          data[i].name.includes(searchString) ||
          data[i].team1.includes(searchString) ||
          data[i].team2.includes(searchString)
        ) {
          newSearch.push(data[i]);
        }
      } catch (error) {
        continue;
      }
    }

    setFilterSearch(newSearch);
  };

  // runs the search filter when the searchString changes from the input
  useEffect(() => {
    handleSearch();
  }, [searchString]);

  useEffect(() => {
    setDataRender(
      // maps through the filtered search to render the data accordingly
      filterSearch.map((result) => {
        // Change result output info depending on type
        if (result.type === "team") {
          return (
            <div className={styles.resultContainer}>
              <img src={result.teamCrest} alt={result.name} />
              {/* Split text info div to make styling easier */}
              <div className={styles.resultInfo}>
                <h3>{result.name} Team</h3>
                <h6>{result.sport}</h6>
              </div>
            </div>
          );
        } else if (result.type === "venue") {
          return (
            <div className={styles.resultContainer}>
              <img src={result.image} alt={result.name} />
              <div className={styles.resultInfo}>
                <h3>{result.name} + Venue</h3>
                <h6>{result.distance} away</h6>
              </div>
            </div>
          );
        } else if (result.type === "fixture") {
          const title =
            result.name === null
              ? result.team1 + " v " + result.team2
              : result.name;

          return (
            <div className={styles.resultContainer}>
              <img src={result.sportLogo} alt={title} />
              <div className={styles.resultInfo}>
                <h3>{title}</h3>
                <h6>{result.startTime} away</h6>
              </div>
            </div>
          );
        }
      })
    );
  }, [filterSearch]);

  return (
    <div className={styles.pageContainer}>
      <input
        className={styles.searchBar}
        onChange={(e) => setSearchString(e.target.value)}
      ></input>
      <div className={styles.resultsContainer}>{dataRender}</div>
    </div>
  );
};

export default Test;
