import { renderHook, act } from "@testing-library/react-hooks";
import { useCountdown } from ".";

jest.useFakeTimers();

describe("useCountdown", () => {
  it("should return secondsLeft as undefined when startCountdown has not been called", () => {
    expect.assertions(1);
    const { result } = renderHook(() => useCountdown());
    expect(result.current.secondsLeft).toBeUndefined();
  });

  it("should decrement secondsLeft by 1 second after 1 second passes", async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown(2);
    });
    expect(result.current.secondsLeft).toStrictEqual(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toStrictEqual(1);
  });

  it("should decrement secondsLeft by 2 seconds after 2 seconds passes", async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown(2);
    });
    expect(result.current.secondsLeft).toStrictEqual(2);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.secondsLeft).toStrictEqual(0);
  });

  it("should decrement secondsLeft to 0 and stop decrementing further", async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown(3);
    });
    expect(result.current.secondsLeft).toStrictEqual(3);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.secondsLeft).toStrictEqual(0);
  });

  it("should not decrement if startCountdown is given negative seconds", () => {
    expect.assertions(2);
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown(-3);
    });
    expect(result.current.secondsLeft).toStrictEqual(0);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.secondsLeft).toStrictEqual(0);
  });
});
