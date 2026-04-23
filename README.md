# jis-keyboard-practice

JIS kana keyboard practice app built with React and Vite.

This project provides a visual JIS kana keyboard map, guided typing practice, and a kana reference view for learning the Oyayubi Shift style layout.

## Screenshot

![App screenshot](./gh-pages-snapshot.png)

## Features

- Interactive keyboard map that reacts to physical key presses
- Practice screen with live target highlighting on the keyboard
- Read-only practice input display driven by actual keyboard input
- Backspace and Delete support for correcting visible input on the practice screen
- Kana reference tab for browsing available characters
- Four practice modes:
	- `通常`: random non-shift kana
	- `通常+シフト`: random normal and shift kana
	- `五十音順`: fixed gojuon order practice
	- `単語`: simple word and phrase prompts

## Screens

- `キーマップ`: shows the JIS kana layout and highlights the pressed key
- `練習`: guided typing practice with score, accuracy, streak, and next-key hint
- `一覧`: reference grid of kana available in the practice layout

## Tech Stack

- React 18
- Vite 5

## Getting Started

### Requirements

- Node.js 18 or later
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite serves the app locally. The configured base path is `/jis-keyboard-practice/`.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
	components/
		Keyboard.jsx
		ModeToggle.jsx
		PracticePanel.jsx
		PromptDisplay.jsx
		ReferenceGrid.jsx
		StatsRow.jsx
	data/
		layout.js
	hooks/
		usePractice.js
		useReactiveKeyboard.js
	App.jsx
	main.jsx
	styles.css
```

## Keyboard Behavior

- The key map and practice keyboard react to physical key presses using `KeyboardEvent.code`
- The top-row mapping is aligned for JIS keyboard positions
- Practice input is displayed in the UI but is not directly editable in the text field
- Printable input is captured globally for practice mode and reflected in the display box

## Notes

- This project is designed around a JIS kana input layout, not a romaji learning flow
- The visual layout and prompts are intended for practice and reference, not IME configuration
