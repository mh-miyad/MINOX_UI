"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PomodoroTimer() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(breakTime * 60);
      } else {
        setMode("focus");
        setTimeLeft(focusTime * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, focusTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(focusTime * 60);
  };

  // const playSound = () => {
  //   const audio = new Audio(
  //   );
  //   audio.play();
  // };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const adjustTime = (type: "focus" | "break", amount: number) => {
    if (type === "focus") {
      const newTime = Math.max(1, Math.min(60, focusTime + amount));
      setFocusTime(newTime);
      if (mode === "focus") setTimeLeft(newTime * 60);
    } else {
      const newTime = Math.max(1, Math.min(15, breakTime + amount));
      setBreakTime(newTime);
      if (mode === "break") setTimeLeft(newTime * 60);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-4">
            <Button
              variant={mode === "focus" ? "default" : "outline"}
              onClick={() => {
                setMode("focus");
                setTimeLeft(focusTime * 60);
                setIsActive(false);
              }}
            >
              Focus
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              onClick={() => {
                setMode("break");
                setTimeLeft(breakTime * 60);
                setIsActive(false);
              }}
            >
              Break
            </Button>
          </div>

          <div className="text-center">
            <div className="text-6xl font-bold mb-8">
              {formatTime(timeLeft)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Focus Time</p>
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustTime("focus", -1)}
                  >
                    -
                  </Button>
                  <span className="w-16 text-center">{focusTime}m</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustTime("focus", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Break Time</p>
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustTime("break", -1)}
                  >
                    -
                  </Button>
                  <span className="w-16 text-center">{breakTime}m</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustTime("break", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={toggleTimer} className="w-32">
                {isActive ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
                className="w-32"
              >
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
