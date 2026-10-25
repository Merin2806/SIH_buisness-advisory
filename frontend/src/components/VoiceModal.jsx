import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Sparkles, 
  ArrowRight,
  Send,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function VoiceModal({ onClose, onStartWithPrompt }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // 'hi', 'mr', 'en'
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseOutput, setResponseOutput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [languages, setLanguages] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    loadLanguages();
    setupSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  const loadLanguages = async () => {
    try {
      const langs = await api.getLanguages();
      setLanguages(langs);
    } catch {
      setLanguages([
        { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी' },
        { code: 'mr', name: 'मराठी (Marathi)', native: 'मराठी' },
        { code: 'en', name: 'English', native: 'English' }
      ]);
    }
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : (selectedLanguage === 'mr' ? 'mr-IN' : 'en-IN');

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interim += event.results[i][0].transcript;
        }
        setTranscript(interim);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setTranscript('');
      setResponseOutput('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch {
          // fallback demonstration trigger
          simulateIndicSpeech();
        }
      } else {
        simulateIndicSpeech();
      }
    }
  };

  const simulateIndicSpeech = () => {
    setIsRecording(true);
    setTimeout(() => {
      const demoTexts = {
        hi: "मैं बारामती में 50 हजार से देसी मुर्गी पालन का व्यापार शुरू करना चाहता हूँ।",
        mr: "मला बारामती ग्रामीण भागात ५० हजार रुपयात गावरान कुक्कुटपालन सुरू करायचे आहे.",
        en: "I want to start a Desi poultry layer farm in Baramati Rural with ₹50,000 seed capital."
      };
      setTranscript(demoTexts[selectedLanguage] || demoTexts.en);
      setIsRecording(false);
    }, 1500);
  };

  const [queryLoading, setQueryLoading] = useState(false);

  const handleProcessQuery = async () => {
    if (!transcript) return;
    setQueryLoading(true);
    try {
      const res = await api.voiceQuery(transcript, selectedLanguage, 'voice_modal');
      const reply = res.reply || res.transcript_text;
      setResponseOutput(reply);
      speakReply(reply);
    } catch (err) {
      const adviceTexts = {
        hi: "बारामती ग्रामीण में 50,000 रुपये के प्रोजेक्ट के लिए मुद्रा शिशु और नाबार्ड पीवीसीएफ योजना सबसे उपयुक्त है। इसमें 15% कैपिटल सब्सिडी (₹7,500) मिलेगी और मासिक किस्त ₹1,438 होगी।",
        mr: "बारामती ग्रामीण भागात ५०,००० रुपयांच्या प्रकल्पासाठी मुद्रा शिशु आणि नाबार्ड पीव्हीसीएफ योजना सर्वोत्तम आहे. यात १५% भांडवली अनुदान (₹७,५००) मिळेल व मासिक हप्ता ₹१,४३८ राहील.",
        en: "For a ₹50,000 poultry unit in Baramati Rural, PMMY Shishu with NABARD PVCF is optimal. You receive a 15% capital subsidy (₹7,500) with a subsidized monthly EMI of ₹1,438."
      };
      const reply = adviceTexts[selectedLanguage] || adviceTexts.en;
      setResponseOutput(reply);
      speakReply(reply);
    } finally {
      setQueryLoading(false);
    }
  };

  const speakReply = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : (selectedLanguage === 'mr' ? 'mr-IN' : 'en-IN');
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(19, 21, 26, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        maxWidth: 580,
        width: '100%',
        padding: 32,
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#EDE7FF',
            color: '#6F3DFF',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: 8
          }}>
            <Globe2 size={14} />
            <span>Bhashini Indic AI Speech Interface</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>
            बोलून प्रश्न विचारा (Voice Assistant)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Speak in your regional language to query village market viability, subsidies, and Mudra rules.
          </p>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
          {[
            { code: 'hi', label: 'हिन्दी' },
            { code: 'mr', label: 'मराठी' },
            { code: 'en', label: 'English' }
          ].map((l) => (
            <button 
              key={l.code}
              onClick={() => setSelectedLanguage(l.code)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 600,
                border: selectedLanguage === l.code ? '2px solid #6F3DFF' : '1px solid #CBD5E1',
                background: selectedLanguage === l.code ? '#EDE7FF' : '#FFFFFF',
                color: selectedLanguage === l.code ? '#6F3DFF' : 'var(--text-secondary)'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Pulsing Mic Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <button 
            onClick={toggleRecording}
            className={isRecording ? 'mic-pulse' : ''}
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: isRecording ? '#EF4444' : 'linear-gradient(135deg, #6F3DFF 0%, #8254FF 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(111, 61, 255, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          <span style={{ fontSize: '0.82rem', color: isRecording ? '#EF4444' : 'var(--text-muted)', fontWeight: 600, marginTop: 12 }}>
            {isRecording ? '🔴 Listening... Speak now' : 'Tap to Speak in Selected Language'}
          </span>
        </div>

        {/* Live Transcript Box */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Recognized Speech / Editable Query
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="e.g. Desi poultry setup in Baramati Rural..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--mineral-grey-border)',
                fontSize: '0.9rem'
              }}
            />
            <button 
              onClick={handleProcessQuery}
              disabled={!transcript}
              className="btn-primary"
              style={{ padding: '10px 16px' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Advisory Voice Feedback Response */}
        {responseOutput && (
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BFE9FF',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369A1' }}>
                Bhashini Synthesized Advisory Response
              </span>
              <button 
                onClick={() => speakReply(responseOutput)}
                style={{ color: '#0284C7', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600 }}
              >
                {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{speaking ? 'Stop' : 'Replay Audio'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#0C4A6E', lineHeight: 1.5 }}>
              {responseOutput}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              onClose();
              if (onStartWithPrompt && transcript) {
                onStartWithPrompt(transcript);
              }
            }}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.9rem' }}
          >
            <span>Proceed to Full 5-Step Assessment with Query</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
