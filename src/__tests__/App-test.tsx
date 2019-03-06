import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer from "react-test-renderer";
import App from "../App";

// fake Date.now to own the libs
import MockDate from "mockdate";

const fakeDateMillis = 1551896555862;

describe("App snapshot", () => {
  jest.useFakeTimers();

  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
    MockDate.set(fakeDateMillis);
  });

  it("correctly fakes Date.now", async () => {
    const fakeNow = Date.now();
    expect(fakeNow).toBe(fakeDateMillis);
  });

  it("renders the loading screen", async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders the root without loading screen", async () => {
    const tree = renderer.create(<App skipLoadingScreen={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
