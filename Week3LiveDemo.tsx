import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- constants/helpers ---
const COLORS = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const MIN_NAME = 2;
const MAX_NAME = 50;
const MIN_AGE = 13;
const MAX_AGE = 120;

export default function Week3LiveDemo() {
  // --- base demo state ---
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [nameError, setNameError] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showMsg, setShowMsg] = useState(true);
  const [charCount, setCharCount] = useState(0);

  // remember name (optional)
  useEffect(() => {
    const saved = localStorage.getItem("week3_name");
    if (saved) {
      setName(saved);
      setCharCount(saved.trim().length);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("week3_name", name);
  }, [name]);

  const handleResetAll = () => {
    setCount(0);
    setName("");
    setGreeting("");
    setNameError("");
    setBgColor("#ffffff");
    setShowMsg(true);
    setCharCount(0);
    localStorage.removeItem("week3_name");
  };

  const handleNameSubmit = () => {
    const t = name.trim();
    setNameError("");
    if (!t) return setNameError("Please enter your name");
    if (t.length < 2) return setNameError("Name must be at least 2 characters");
    if (t.length > 30) return setNameError("Name must be at most 30 characters");
    setGreeting(`Hello, ${t}!`);
  };

  const disableSayHello = name.trim().length < 2 || name.trim().length > 30;

  // --- advanced challenge state ---
  const [mfName, setMfName] = useState("");
  const [mfAge, setMfAge] = useState<string>("");
  const [mfEmail, setMfEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, age: false, email: false });

  const mfNameError = useMemo(() => {
    const t = mfName.trim();
    if (!t) return "Name is required";
    if (t.length < MIN_NAME) return `Name must be at least ${MIN_NAME} characters`;
    if (t.length > MAX_NAME) return `Name must be at most ${MAX_NAME} characters`;
    return "";
  }, [mfName]);

  const mfAgeError = useMemo(() => {
    if (mfAge === "") return "Age is required";
    const n = Number(mfAge);
    if (Number.isNaN(n)) return "Age must be a number";
    if (!Number.isInteger(n)) return "Age must be a whole number";
    if (n < MIN_AGE || n > MAX_AGE) return `Age must be between ${MIN_AGE}–${MAX_AGE}`;
    return "";
  }, [mfAge]);

  const mfEmailError = useMemo(() => {
    const t = mfEmail.trim();
    if (!t) return "Email is required";
    if (!EMAIL_RE.test(t)) return "Enter a valid email address";
    return "";
  }, [mfEmail]);

  const mfIsValid = !mfNameError && !mfAgeError && !mfEmailError;

  const submitMultiField = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, age: true, email: true });
    if (!mfIsValid) return;
    alert(
      `Submitted!\nName: ${mfName.trim()}\nAge: ${clamp(Number(mfAge), MIN_AGE, MAX_AGE)}\nEmail: ${mfEmail.trim()}`
    );
    setMfName("");
    setMfAge("");
    setMfEmail("");
    setTouched({ name: false, age: false, email: false });
  };

  // --- UI ---
  return (
    <div className="space-y-10">
      {/* Base Demo Card */}
      <Card style={{ background: bgColor }}>
        <CardHeader>
          <CardTitle>Week 3 Interactive Demo</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Counter */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium">Counter: {count}</span>
            <Button variant="outline" onClick={() => setCount((c) => c + 1)}>
              +1
            </Button>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  const v = e.target.value;
                  setName(v);
                  setGreeting("");
                  setNameError("");
                  setCharCount(v.trim().length);
                }}
              />
              <Button onClick={handleNameSubmit} disabled={disableSayHello}>
                Say Hello
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setName("");
                  setGreeting("");
                  setNameError("");
                  setCharCount(0);
                  localStorage.removeItem("week3_name");
                }}
              >
                Clear
              </Button>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span className={nameError ? "text-red-600" : ""}>
                {nameError || (disableSayHello ? "Enter 2–30 characters" : "Looks good")}
              </span>
              <span>{charCount}/30</span>
            </div>
            {greeting && <p className="text-green-700 font-medium">{greeting}</p>}
          </div>

          {/* Color Picker */}
          <div className="text-center space-y-2">
            <span className="font-semibold">Pick a background color:</span>
            <div className="flex justify-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ background: c, borderColor: "#fff" }}
                  onClick={() => setBgColor(c)}
                  aria-label={`Pick ${c}`}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Toggle Message */}
          <div className="text-center space-y-2">
            <Button onClick={() => setShowMsg((v) => !v)}>
              {showMsg ? "Hide Message" : "Show Message"}
            </Button>
            {showMsg && <p className="text-blue-700">This message can be toggled!</p>}
          </div>

          {/* Reset All */}
          <div className="flex justify-center">
            <Button variant="destructive" onClick={handleResetAll}>
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Challenge: Multi-Field Form */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Challenge: Multi-Field Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitMultiField} className="space-y-4 max-w-lg mx-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-xs text-gray-500">(2–50 chars)</span>
              </label>
              <Input
                value={mfName}
                onChange={(e) => setMfName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Your name"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={touched.name && mfNameError ? "text-red-600" : "text-gray-600"}>
                  {touched.name && mfNameError ? mfNameError : "Looks good"}
                </span>
                <span>{mfName.trim().length}/{MAX_NAME}</span>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Age <span className="text-xs text-gray-500">(13–120)</span>
              </label>
              <Input
                type="number"
                value={mfAge}
                onChange={(e) => setMfAge(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, age: true }))}
                placeholder="18"
              />
              <p className={`text-xs mt-1 ${touched.age && mfAgeError ? "text-red-600" : "text-gray-600"}`}>
                {touched.age && mfAgeError ? mfAgeError : "Looks good"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-xs text-gray-500">(must be valid)</span>
              </label>
              <Input
                type="email"
                value={mfEmail}
                onChange={(e) => setMfEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@example.com"
              />
              <p className={`text-xs mt-1 ${touched.email && mfEmailError ? "text-red-600" : "text-gray-600"}`}>
                {touched.email && mfEmailError ? mfEmailError : "Looks good"}
              </p>
            </div>

            <Button type="submit" disabled={!mfIsValid}>
              Submit
            </Button>
            {!mfIsValid && <p className="text-xs text-gray-500 mt-2">All fields must be valid to submit.</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
