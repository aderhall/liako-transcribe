import { useMemo, useState } from 'react'
import './App.css'

// TODO: numerals and punctuation

const exampleWords = ["kde", "hllye", "diko", "a", "dpawkoshi", "gawshe", "sha", "pi", "re", "boshi", "!adiko", "!adilyako", "lyegáo", "síoteke", "takare", "boka", "saoda", "siake", "tkioda", "dpawre", "pgao", "hllyako", "rsida", "!iakó", "!iakashí", "rsia", "!ikase", "!ikao", "!iakitá", "hla", "e", "hlo", "tki", "doboto", "kdo!e", "lo", "riya", "rhle", "taka", "dobopi"]

function getBareVowelCode(vowel: string) {
  switch (vowel) {
    case 'a':
    case 'á':
      return 210;
    case 'o':
    case 'ó':
    case 'aw':
    case 'áw':
      return 211;
    case 'e':
    case 'é':
      return 212;
    case 'i':
    case 'í':
      return 213;
  }
}

function getRegularVowelCode(vowel: string) {
  switch (vowel) {
    case 'a':
    case 'á':
      return 65;
    case 'o':
    case 'ó':
    case 'aw':
    case 'áw':
      return 81;
    case 'e':
    case 'é':
      return 103;
    case 'i':
    case 'í':
      return 119;
  }
}

function mapLiakoToASCII(vowel: string, consonant: string) {
  if (!consonant) {
    const code = getBareVowelCode(vowel);
    if (code) {
      return String.fromCharCode(code);
    } else {
      return '';
    }
  } else {
    const regConsonant = ["p", "b", "t", "d", "k", "g", "s", "sh", "hl", "dp", "pg", "dg", "kd", "tk", "bt", "hlly"].indexOf(consonant);
    if (regConsonant !== -1) {
      const baseVowel = getRegularVowelCode(vowel);
      if (!baseVowel) {
        return '';
      }
      let code = baseVowel + regConsonant;
      // Correct for gaps in the font
      if (code >= 91 && code < 97) {
        code += 97-91;
      }
      if (code >= 123 && code < 192) {
        code += 192-123;
      }
      return String.fromCharCode(code);
    } else {
      let consonantCode = 0;
      switch (consonant) {
        case 'l':
        case 'lj':
        case 'ly':
          consonantCode = 204;
          break;
        case 'j':
        case 'y':
          consonantCode = 205;
          break;
        case 'r':
          consonantCode = 206;
          break;
        case 'rs':
          consonantCode = 207;
          break;
        case 'rsh':
          consonantCode = 208;
          break;
        case 'rhl':
          consonantCode = 209;
          break;
        case '!':
          consonantCode = -1;
      }
      const vowelCode = getBareVowelCode(vowel);
      if (!vowelCode || !consonantCode) {
        return '';
      }
      if (consonantCode === -1) {
        return String.fromCharCode(vowelCode);
      }
      return String.fromCharCode(consonantCode) + String.fromCharCode(vowelCode);
    }
  }
}

function transcribe(text: string) {
  // Regex match the string and return all match groups 1 and 2
    
  return text.toLowerCase().split('\n').map((line) => line.split(' ')
    .map(word => 
      [
        ...word.matchAll(
          /(dp|dg|kd|pg|bt|tk|hlly|rsh|rs|rhl|r|p|b|t|d|k|g|sh|s|lj|ly|l|hl|y|j|!)?(aw|áw|a|á|o|ó|e|é|i|í)/g
        )
      ].map(([_syllable, consonant, vowel]) => mapLiakoToASCII(vowel, consonant)).join('')
  ).join(' ')).join('\n');
}

function App() {
  const [text, setText] = useState('')
  
  const placeholder = exampleWords[Math.floor(Math.random() * exampleWords.length)];
  
  const liakoText = useMemo(() => text ? transcribe(text) : transcribe(placeholder), [text, placeholder]);

  return (
    <div className="w-1/2 m-auto">
      <h2>Liako phonetic transcriptions</h2>
      <div className="w-full flex justify-between mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-1/2 h-48 p-2 border border-gray-300 rounded-md overflow-y-scroll"
        />
        {/*<div>{liakoText.split('\n').map((line, idx) => <p key={idx} className={"text-right text-xl" + (text ? "" : " text-gray-400")} style={{fontFamily: "liako"}}>{reverseDirection(line)}</p>)}</div>*/}
        <div>{liakoText.split('\n').map((line, idx) => <p key={idx} className={"text-right text-xl" + (text ? "" : " text-gray-400")} style={{fontFamily: "liako"}}>&#8238;{line}</p>)}</div>
        {/*<div className='block'><p>{liakoText}</p></div>*/}
      </div>
    </div>
  )
}

export default App
